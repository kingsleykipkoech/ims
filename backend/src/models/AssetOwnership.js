import mongoose from 'mongoose';

const assetOwnershipSchema = new mongoose.Schema({
    investor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', required: true },
    asset_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    percentage_share: { type: Number, required: true, min: 0, max: 100 },
    created_at: { type: Date, default: Date.now },
});

assetOwnershipSchema.index({ investor_id: 1 });
assetOwnershipSchema.index({ asset_id: 1 });

const AssetOwnership = mongoose.model('AssetOwnership', assetOwnershipSchema);
export default AssetOwnership;
