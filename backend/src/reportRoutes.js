import express from 'express';
import Transaction from './models/Transaction.js';
import Asset from './models/Asset.js';
import Investor from './models/Investor.js';
import { authenticateToken, requireAdmin } from './authMiddleware.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

// Asset value report
router.get('/assets', async (req, res) => {
    try {
        const assets = await Asset.find().sort({ value: -1 });
        const total = assets.reduce((sum, a) => sum + a.value, 0);
        res.json({ assets, total });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Yearly contribution report
router.get('/contributions/yearly', async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            { $match: { type: 'contribution', status: 'approved' } },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        investor_id: '$investor_id',
                    },
                    total_contributed: { $sum: '$amount' },
                    transaction_count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'investors',
                    localField: '_id.investor_id',
                    foreignField: '_id',
                    as: 'investor',
                },
            },
            { $unwind: { path: '$investor', preserveNullAndEmpty: true } },
            {
                $project: {
                    year: '$_id.year',
                    investor_id: '$_id.investor_id',
                    investor_name: '$investor.name',
                    investor_email: '$investor.email',
                    total_contributed: 1,
                    transaction_count: 1,
                    average_contribution: { $divide: ['$total_contributed', '$transaction_count'] },
                },
            },
            { $sort: { year: -1, total_contributed: -1 } },
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Monthly contribution report
router.get('/contributions/monthly', async (req, res) => {
    try {
        const { year } = req.query;
        const matchStage = { type: 'contribution', status: 'approved' };
        if (year) {
            matchStage.date = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`),
            };
        }

        const result = await Transaction.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        investor_id: '$investor_id',
                    },
                    total_contributed: { $sum: '$amount' },
                    transaction_count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'investors',
                    localField: '_id.investor_id',
                    foreignField: '_id',
                    as: 'investor',
                },
            },
            { $unwind: { path: '$investor', preserveNullAndEmpty: true } },
            {
                $project: {
                    year: '$_id.year',
                    month: '$_id.month',
                    investor_id: '$_id.investor_id',
                    investor_name: '$investor.name',
                    investor_email: '$investor.email',
                    total_contributed: 1,
                    transaction_count: 1,
                },
            },
            { $sort: { year: -1, month: -1, total_contributed: -1 } },
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Interest distribution report
router.get('/interests', async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            { $match: { type: 'interest', status: 'approved' } },
            {
                $group: {
                    _id: '$investor_id',
                    total_interest: { $sum: '$amount' },
                    transaction_count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'investors',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'investor',
                },
            },
            { $unwind: { path: '$investor', preserveNullAndEmpty: true } },
            {
                $project: {
                    investor_id: '$_id',
                    investor_name: '$investor.name',
                    investor_email: '$investor.email',
                    total_interest: 1,
                    transaction_count: 1,
                },
            },
            { $sort: { total_interest: -1 } },
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Investor statistics report
router.get('/investor-stats', async (req, res) => {
    try {
        const investors = await Investor.find().select('-password_hash').sort({ total_bonds: -1 });
        const totalContributions = await Transaction.aggregate([
            { $match: { type: 'contribution', status: 'approved' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const systemTotal = totalContributions[0]?.total || 0;
        res.json({ investors, systemTotal });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
