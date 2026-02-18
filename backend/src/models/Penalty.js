import mongoose from 'mongoose';

const penaltySchema = new mongoose.Schema({
    investor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
});

penaltySchema.index({ investor_id: 1 });

const Penalty = mongoose.model('Penalty', penaltySchema);
export default Penalty;
