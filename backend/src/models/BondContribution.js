import mongoose from 'mongoose';

const bondContributionSchema = new mongoose.Schema({
    investor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', required: true },
    bond_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bond', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
});

bondContributionSchema.index({ investor_id: 1 });
bondContributionSchema.index({ bond_id: 1 });

const BondContribution = mongoose.model('BondContribution', bondContributionSchema);
export default BondContribution;
