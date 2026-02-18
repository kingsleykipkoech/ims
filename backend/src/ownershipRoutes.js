import express from 'express';
import AssetOwnership from './models/AssetOwnership.js';
import { authenticateToken, requireAdmin } from './authMiddleware.js';

const router = express.Router();

// Get all ownerships (admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const ownerships = await AssetOwnership.find()
            .populate('investor_id', 'name email')
            .populate('asset_id', 'name value')
            .sort({ created_at: -1 });
        res.json(ownerships);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get ownerships by asset
router.get('/asset/:assetId', authenticateToken, async (req, res) => {
    try {
        const ownerships = await AssetOwnership.find({ asset_id: req.params.assetId })
            .populate('investor_id', 'name email');
        res.json(ownerships);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create ownership (admin)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { investor_id, asset_id, percentage_share } = req.body;
        if (!investor_id || !asset_id || percentage_share === undefined) {
            return res.status(400).json({ message: 'investor_id, asset_id, and percentage_share are required' });
        }
        const ownership = new AssetOwnership({ investor_id, asset_id, percentage_share });
        await ownership.save();
        const populated = await AssetOwnership.findById(ownership._id)
            .populate('investor_id', 'name email')
            .populate('asset_id', 'name value');
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update ownership (admin)
router.patch('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const ownership = await AssetOwnership.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('investor_id', 'name email')
            .populate('asset_id', 'name value');
        if (!ownership) return res.status(404).json({ message: 'Ownership not found' });
        res.json(ownership);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete ownership (admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await AssetOwnership.findByIdAndDelete(req.params.id);
        res.json({ message: 'Ownership deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
