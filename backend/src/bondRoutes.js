import express from 'express';
import Bond from './models/Bond.js';
import BondContribution from './models/BondContribution.js';
import { authenticateToken, requireAdmin } from './authMiddleware.js';

const router = express.Router();

// Get all bonds
router.get('/', authenticateToken, async (req, res) => {
    try {
        const bonds = await Bond.find().sort({ created_at: -1 });
        res.json(bonds);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create bond (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, term, interest_rate, maturity_date, description } = req.body;
        if (!name || !term || !interest_rate) {
            return res.status(400).json({ message: 'Name, term, and interest_rate are required' });
        }
        const bond = new Bond({ name, term, interest_rate, maturity_date, description });
        await bond.save();
        res.status(201).json(bond);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update bond (admin only)
router.patch('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const bond = await Bond.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bond) return res.status(404).json({ message: 'Bond not found' });
        res.json(bond);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete bond (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const bond = await Bond.findByIdAndDelete(req.params.id);
        if (!bond) return res.status(404).json({ message: 'Bond not found' });
        res.json({ message: 'Bond deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bond contributions (admin)
router.get('/contributions', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const contributions = await BondContribution.find()
            .populate('investor_id', 'name email')
            .populate('bond_id', 'name interest_rate')
            .sort({ date: -1 });
        res.json(contributions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create bond contribution
router.post('/contribute', authenticateToken, async (req, res) => {
    try {
        const { bond_id, amount } = req.body;
        if (!bond_id || !amount) {
            return res.status(400).json({ message: 'bond_id and amount are required' });
        }
        const contribution = new BondContribution({
            investor_id: req.user.id,
            bond_id,
            amount,
        });
        await contribution.save();
        res.status(201).json(contribution);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
