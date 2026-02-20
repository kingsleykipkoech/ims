import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import Swal from 'sweetalert2';
import { Bell, Plus, Trash2 } from 'lucide-react';

const AdminAnnouncementsTab = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        priority: 'normal'
    });

    const fetchAnnouncements = () => {
        apiClient.get('/admin/announcements')
            .then(res => setAnnouncements(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/admin/announcements', formData);
            Swal.fire('Success', 'Announcement published', 'success');
            setFormData({ title: '', content: '', priority: 'normal' });
            fetchAnnouncements();
        } catch {
            Swal.fire('Error', 'Failed to publish announcement', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/admin/announcements/${id}`);
            setAnnouncements(announcements.filter(a => a._id !== id));
            Swal.fire('Deleted', 'Announcement removed', 'success');
        } catch {
            Swal.fire('Error', 'Failed to delete', 'error');
        }
    };

    return (
        <div className="p-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Plus size={20} className="text-blue-500" /> New Announcement
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Content</label>
                            <textarea
                                required
                                rows="4"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition shadow-lg shadow-blue-500/20">
                            Publish
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
                {announcements.map((item) => (
                    <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative group">
                        <button
                            onClick={() => handleDelete(item._id)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                            {item.priority === 'urgent' && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold uppercase">Urgent</span>}
                            {item.priority === 'high' && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold uppercase">High</span>}
                        </div>
                        <p className="text-slate-600 whitespace-pre-line text-sm">{item.content}</p>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                            Published on {new Date(item.created_at || new Date()).toLocaleDateString()}
                        </div>
                    </div>
                ))}
                {announcements.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                        No announcements published.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAnnouncementsTab;
