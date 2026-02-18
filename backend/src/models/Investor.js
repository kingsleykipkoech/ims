import mongoose from 'mongoose';

const investorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    national_id_number: { type: String, trim: true },
    total_bonds: { type: Number, default: 0 },
    percentage_share: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'suspended', 'deactivated'], default: 'active' },
    date_of_joining: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
});

investorSchema.index({ email: 1 });
investorSchema.index({ status: 1 });

const Investor = mongoose.model('Investor', investorSchema);
export default Investor;
