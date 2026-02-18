import mongoose from 'mongoose';

const auditTrailSchema = new mongoose.Schema({
    action: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId },
    user_role: { type: String, enum: ['investor', 'admin'] },
    details: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
});

auditTrailSchema.index({ timestamp: -1 });
auditTrailSchema.index({ user_id: 1 });

const AuditTrail = mongoose.model('AuditTrail', auditTrailSchema);
export default AuditTrail;
