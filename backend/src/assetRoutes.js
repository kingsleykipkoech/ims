import express from 'express';
import Asset from './models/Asset.js';
import { authenticateToken } from './authMiddleware.js';

const router = express.Router();

// Get all assets (accessible to both investors and admins)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const assets = await Asset.find().sort({ created_at: -1 });
        res.json(assets);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single asset
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        res.json(asset);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create asset (admin only)
router.post('/', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
        const { name, value, description } = req.body;
        if (!name || value === undefined) {
            return res.status(400).json({ message: 'Name and value are required' });
        }
        const asset = new Asset({ name, value, description });
        await asset.save();
        res.status(201).json(asset);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update asset (admin only)
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
        const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        res.json(asset);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete asset (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
        const asset = await Asset.findByIdAndDelete(req.params.id);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        res.json({ message: 'Asset deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
