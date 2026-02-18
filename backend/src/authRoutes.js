import express from 'express';
import {
    registerInvestor,
    loginInvestor,
    loginAdmin,
    refreshToken,
    getUser,
} from './authController.js';
import { authenticateToken } from './authMiddleware.js';

const router = express.Router();

router.post('/register', registerInvestor);
router.post('/login/investor', loginInvestor);
router.post('/login/admin', loginAdmin);
router.post('/refresh', refreshToken);
router.get('/user', authenticateToken, getUser);

export default router;
