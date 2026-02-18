import express from 'express';
import Investor from './models/Investor.js';
import Transaction from './models/Transaction.js';
import Asset from './models/Asset.js';
import AuditTrail from './models/AuditTrail.js';
import Announcement from './models/Announcement.js';
import Expense from './models/Expense.js';
import { authenticateToken, requireAdmin } from './authMiddleware.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

// ---- Investors ----
router.get('/investors', async (req, res) => {
    try {
        const investors = await Investor.find().select('-password_hash').sort({ created_at: -1 });
        res.json(investors);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/investor/:id', async (req, res) => {
    try {
        const { password, ...updates } = req.body; // prevent password update via this route
        const investor = await Investor.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password_hash');
        if (!investor) return res.status(404).json({ message: 'Investor not found' });

        await AuditTrail.create({
            action: 'UPDATE_INVESTOR',
            user_id: req.user.id,
            user_role: 'admin',
            details: { investor_id: req.params.id, updates },
        });

        res.json(investor);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/investor/:id', async (req, res) => {
    try {
        const investor = await Investor.findByIdAndDelete(req.params.id);
        if (!investor) return res.status(404).json({ message: 'Investor not found' });

        await AuditTrail.create({
            action: 'DELETE_INVESTOR',
            user_id: req.user.id,
            user_role: 'admin',
            details: { investor_id: req.params.id, investor_email: investor.email },
        });

        res.json({ message: 'Investor deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---- Transactions ----
router.get('/transactions', async (req, res) => {
    try {
        const { status, type } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;

        const transactions = await Transaction.find(filter)
            .populate('investor_id', 'name email')
            .populate('asset_id', 'name value')
            .sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/transactions/pending', async (req, res) => {
    try {
        const transactions = await Transaction.find({ status: 'pending' })
            .populate('investor_id', 'name email')
            .populate('asset_id', 'name value')
            .sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/transactions/:id', async (req, res) => {
    try {
        const { status, rejection_reason } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be approved or rejected' });
        }

        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        transaction.status = status;
        if (rejection_reason) transaction.rejection_reason = rejection_reason;
        await transaction.save();

        if (status === 'approved' && transaction.type === 'contribution') {
            // Recalculate investor total_bonds and percentage_share
            const investorTransactions = await Transaction.find({
                investor_id: transaction.investor_id,
                type: 'contribution',
                status: 'approved',
            });
            const investorTotal = investorTransactions.reduce((sum, t) => sum + t.amount, 0);

            const allTransactions = await Transaction.find({ type: 'contribution', status: 'approved' });
            const systemTotal = allTransactions.reduce((sum, t) => sum + t.amount, 0);

            const percentage_share = systemTotal > 0 ? (investorTotal / systemTotal) * 100 : 0;

            await Investor.findByIdAndUpdate(transaction.investor_id, {
                total_bonds: investorTotal,
                percentage_share: Math.round(percentage_share * 100) / 100,
            });

            // Recalculate all other investors' percentage shares
            const allInvestorIds = [...new Set(allTransactions.map(t => t.investor_id.toString()))];
            for (const invId of allInvestorIds) {
                if (invId === transaction.investor_id.toString()) continue;
                const invTxns = allTransactions.filter(t => t.investor_id.toString() === invId);
                const invTotal = invTxns.reduce((sum, t) => sum + t.amount, 0);
                const invShare = systemTotal > 0 ? (invTotal / systemTotal) * 100 : 0;
                await Investor.findByIdAndUpdate(invId, {
                    total_bonds: invTotal,
                    percentage_share: Math.round(invShare * 100) / 100,
                });
            }
        }

        await AuditTrail.create({
            action: `TRANSACTION_${status.toUpperCase()}`,
            user_id: req.user.id,
            user_role: 'admin',
            details: { transaction_id: req.params.id, status },
        });

        const populated = await Transaction.findById(req.params.id)
            .populate('investor_id', 'name email')
            .populate('asset_id', 'name value');

        res.json(populated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ---- Dashboard Stats ----
router.get('/dashboard-stats', async (req, res) => {
    try {
        const [totalInvestors, assets, pendingCount] = await Promise.all([
            Investor.countDocuments({ status: 'active' }),
            Asset.find(),
            Transaction.countDocuments({ status: 'pending' }),
        ]);

        const totalAssetValue = assets.reduce((sum, a) => sum + a.value, 0);

        // Monthly contributions (current month)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyTxns = await Transaction.find({
            type: 'contribution',
            status: 'approved',
            date: { $gte: startOfMonth },
        });
        const monthlyContributions = monthlyTxns.reduce((sum, t) => sum + t.amount, 0);

        res.json({
            totalInvestors,
            totalAssetValue,
            pendingApprovals: pendingCount,
            monthlyContributions,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---- Total Asset Value ----
router.get('/total-asset-value', async (req, res) => {
    try {
        const assets = await Asset.find();
        const total = assets.reduce((sum, a) => sum + a.value, 0);
        res.json({ total, count: assets.length });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---- Announcements ----
router.get('/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ published_at: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/announcements', async (req, res) => {
    try {
        const { title, content, target_audience, priority } = req.body;
        if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
        const announcement = new Announcement({
            title, content, target_audience, priority,
            created_by: req.user.id,
        });
        await announcement.save();
        res.status(201).json(announcement);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/announcements/:id', async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
        res.json(announcement);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/announcements/:id', async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Announcement deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---- Expenses ----
router.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/expenses', async (req, res) => {
    try {
        const { category, amount, date, description } = req.body;
        if (!category || !amount) return res.status(400).json({ message: 'Category and amount are required' });
        const expense = new Expense({ category, amount, date, description });
        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/expenses/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/expenses/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
