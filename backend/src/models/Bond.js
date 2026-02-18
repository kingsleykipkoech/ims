import mongoose from 'mongoose';

const bondSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    term: { type: Number, required: true }, // in months
    interest_rate: { type: Number, required: true }, // percentage
    maturity_date: { type: Date },
    description: { type: String, trim: true },
    created_at: { type: Date, default: Date.now },
});

const Bond = mongoose.model('Bond', bondSchema);
export default Bond;
