import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    investor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', required: true },
    asset_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', default: null },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['contribution', 'interest', 'withdrawal'], required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejection_reason: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
});

transactionSchema.index({ investor_id: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ date: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
