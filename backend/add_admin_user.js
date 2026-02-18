import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Admin from './src/models/Admin.js';

const ADMIN_EMAIL = 'admin@ims.com';
const ADMIN_PASSWORD = 'admin123';

async function addAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ims');
        console.log('Connected to MongoDB');

        const existing = await Admin.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log(`Admin already exists: ${ADMIN_EMAIL}`);
            process.exit(0);
        }

        const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
        const admin = new Admin({ email: ADMIN_EMAIL, password_hash });
        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log(`   Email: ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log('   ⚠️  Change this password in production!');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
}

addAdmin();
