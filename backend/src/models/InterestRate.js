import mongoose from 'mongoose';

const interestRateSchema = new mongoose.Schema({
    rate_percentage: { type: Number, required: true },
    category: { type: String, required: true, trim: true }, // e.g. 'bonds', 'contributions'
    effective_date: { type: Date, required: true },
    end_date: { type: Date, default: null },
    created_at: { type: Date, default: Date.now },
});

const InterestRate = mongoose.model('InterestRate', interestRateSchema);
export default InterestRate;
