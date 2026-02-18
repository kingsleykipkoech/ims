import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Investor from './models/Investor.js';
import Admin from './models/Admin.js';

const SALT_ROUNDS = 12;

const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: payload.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

export const registerInvestor = async (req, res) => {
    try {
        const { name, email, password, national_id_number } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const existing = await Investor.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        const investor = new Investor({ name, email, password_hash, national_id_number });
        await investor.save();

        res.status(201).json({ message: 'Investor registered successfully', investor_id: investor._id });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const loginInvestor = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const investor = await Investor.findOne({ email: email.toLowerCase() });
        if (!investor) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (investor.status !== 'active') {
            return res.status(403).json({ message: `Account is ${investor.status}. Please contact admin.` });
        }

        const valid = await bcrypt.compare(password, investor.password_hash);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { accessToken, refreshToken } = generateTokens({
            id: investor._id,
            email: investor.email,
            role: 'investor',
            name: investor.name,
        });

        res.json({
            accessToken,
            refreshToken,
            user: { id: investor._id, name: investor.name, email: investor.email, role: 'investor' },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const valid = await bcrypt.compare(password, admin.password_hash);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const { accessToken, refreshToken } = generateTokens({
            id: admin._id,
            email: admin.email,
            role: 'admin',
        });

        res.json({
            accessToken,
            refreshToken,
            user: { id: admin._id, email: admin.email, role: 'admin' },
        });
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ message: 'Server error during admin login' });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Refresh token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        // Try investor first, then admin
        let user = await Investor.findById(decoded.id);
        let role = 'investor';
        if (!user) {
            user = await Admin.findById(decoded.id);
            role = 'admin';
        }
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const payload = role === 'investor'
            ? { id: user._id, email: user.email, role, name: user.name }
            : { id: user._id, email: user.email, role };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id, role } = req.user;
        if (role === 'investor') {
            const investor = await Investor.findById(id).select('-password_hash');
            if (!investor) return res.status(404).json({ message: 'User not found' });
            return res.json({ ...investor.toObject(), role: 'investor' });
        } else {
            const admin = await Admin.findById(id).select('-password_hash');
            if (!admin) return res.status(404).json({ message: 'Admin not found' });
            return res.json({ ...admin.toObject(), role: 'admin' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
