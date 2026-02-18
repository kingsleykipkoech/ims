import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticateToken, requireAdmin } from './authMiddleware.js';
import Asset from './models/Asset.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

const router = express.Router();

// Upload document
router.post('/upload', authenticateToken, requireAdmin, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const { asset_id } = req.body;
        const fileInfo = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            uploaded_at: new Date(),
        };

        if (asset_id) {
            await Asset.findByIdAndUpdate(asset_id, { document: req.file.filename });
        }

        res.status(201).json({ message: 'File uploaded successfully', file: fileInfo });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: 'Upload failed' });
    }
});

// Get/download document
router.get('/:filename', authenticateToken, (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }
    res.sendFile(filePath);
});

// Delete document
router.delete('/:filename', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const filePath = path.join(uploadDir, req.params.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.json({ message: 'File deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed' });
    }
});

// List all uploaded documents
router.get('/', authenticateToken, requireAdmin, (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir).map(filename => ({
            filename,
            path: `/api/documents/${filename}`,
            uploaded_at: fs.statSync(path.join(uploadDir, filename)).mtime,
        }));
        res.json(files);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
