import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    value: { type: Number, required: true, default: 0 },
    document: { type: String, default: null }, // GridFS file ID or filename
    description: { type: String, trim: true },
    created_at: { type: Date, default: Date.now },
});

assetSchema.index({ name: 1 });

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;
