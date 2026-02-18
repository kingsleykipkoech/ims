import express from 'express';
import InterestRate from './models/InterestRate.js';
import Penalty from './models/Penalty.js';
import { authenticateToken, requireAdmin } from './authMiddleware.js';

const router = express.Router();

// ---- Interest Rates ----

// Get all interest rates
router.get('/interest-rates', authenticateToken, async (req, res) => {
    try {
        const rates = await InterestRate.find().sort({ effective_date: -1 });
        res.json(rates);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create interest rate (admin only)
router.post('/interest-rates', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { rate_percentage, category, effective_date, end_date } = req.body;
        if (!rate_percentage || !category || !effective_date) {
            return res.status(400).json({ message: 'rate_percentage, category, and effective_date are required' });
        }
        const rate = new InterestRate({ rate_percentage, category, effective_date, end_date });
        await rate.save();
        res.status(201).json(rate);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update interest rate (admin only)
router.patch('/interest-rates/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const rate = await InterestRate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!rate) return res.status(404).json({ message: 'Interest rate not found' });
        res.json(rate);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete interest rate (admin only)
router.delete('/interest-rates/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await InterestRate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Interest rate deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---- Penalties ----

// Get all penalties (admin)
router.get('/penalties', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const penalties = await Penalty.find()
            .populate('investor_id', 'name email')
            .sort({ date: -1 });
        res.json(penalties);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create penalty (admin only)
router.post('/penalties', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { investor_id, amount, reason, date } = req.body;
        if (!investor_id || !amount || !reason) {
            return res.status(400).json({ message: 'investor_id, amount, and reason are required' });
        }
        const penalty = new Penalty({ investor_id, amount, reason, date });
        await penalty.save();
        res.status(201).json(penalty);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete penalty (admin only)
router.delete('/penalties/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await Penalty.findByIdAndDelete(req.params.id);
        res.json({ message: 'Penalty deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
