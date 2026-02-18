import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
