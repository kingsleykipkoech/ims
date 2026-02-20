import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './db.js';

import authRoutes from './authRoutes.js';
import investorRoutes from './investorRoutes.js';
import adminRoutes from './adminRoutes.js';
import assetRoutes from './assetRoutes.js';
import bondRoutes from './bondRoutes.js';
import interestPenaltyRoutes from './interestPenaltyRoutes.js';
import reportRoutes from './reportRoutes.js';
import ownershipRoutes from './ownershipRoutes.js';
import documentsRoutes from './documentsRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://kingsleykipkoech.github.io',
        process.env.CORS_ORIGIN
    ].filter(Boolean),
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
await connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/investor', investorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/bonds', bondRoutes);
app.use('/api', interestPenaltyRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ownership', ownershipRoutes);
app.use('/api/documents', documentsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 IMS Backend running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
});
