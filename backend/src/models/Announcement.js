import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    target_audience: { type: String, enum: ['all', 'investors', 'admins'], default: 'all' },
    priority: { type: String, enum: ['normal', 'high', 'urgent'], default: 'normal' },
    created_at: { type: Date, default: Date.now },
    published_at: { type: Date, default: Date.now },
});

announcementSchema.index({ published_at: -1 });

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
