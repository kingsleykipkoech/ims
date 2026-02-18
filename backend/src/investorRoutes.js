import express from 'express';
import Transaction from './models/Transaction.js';
import Investor from './models/Investor.js';
import Asset from './models/Asset.js';
import AssetOwnership from './models/AssetOwnership.js';
import BondContribution from './models/BondContribution.js';
import Announcement from './models/Announcement.js';
import Penalty from './models/Penalty.js';
import { authenticateToken, requireInvestor } from './authMiddleware.js';

const router = express.Router();

// All investor routes require auth
router.use(authenticateToken, requireInvestor);

// Get own profile
router.get('/profile', async (req, res) => {
    try {
        const investor = await Investor.findById(req.user.id).select('-password_hash');
        if (!investor) return res.status(404).json({ message: 'Investor not found' });
        res.json(investor);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit a contribution
router.post('/contribute', async (req, res) => {
    try {
        const { amount, asset_id } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount is required' });
        }

        const transaction = new Transaction({
            investor_id: req.user.id,
            asset_id: asset_id || null,
            amount,
            type: 'contribution',
            status: 'pending',
        });
        await transaction.save();

        res.status(201).json({ message: 'Contribution submitted for approval', transaction });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get own transactions
router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find({ investor_id: req.user.id })
            .populate('asset_id', 'name value')
            .sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get own interest transactions
router.get('/interest', async (req, res) => {
    try {
        const transactions = await Transaction.find({ investor_id: req.user.id, type: 'interest' })
            .sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get own bond contributions
router.get('/bonds', async (req, res) => {
    try {
        const contributions = await BondContribution.find({ investor_id: req.user.id })
            .populate('bond_id', 'name interest_rate term maturity_date')
            .sort({ date: -1 });
        res.json(contributions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get investor rankings
router.get('/rankings', async (req, res) => {
    try {
        const investors = await Investor.find({ status: 'active' })
            .select('name email total_bonds percentage_share date_of_joining')
            .sort({ total_bonds: -1 });
        res.json(investors);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get own asset ownerships
router.get('/asset-ownership', async (req, res) => {
    try {
        const ownerships = await AssetOwnership.find({ investor_id: req.user.id })
            .populate('asset_id', 'name value description');
        res.json(ownerships);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get announcements
router.get('/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find({
            target_audience: { $in: ['all', 'investors'] },
        }).sort({ published_at: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get own penalties
router.get('/penalties', async (req, res) => {
    try {
        const penalties = await Penalty.find({ investor_id: req.user.id }).sort({ date: -1 });
        res.json(penalties);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
