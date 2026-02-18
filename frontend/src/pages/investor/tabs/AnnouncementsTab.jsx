import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import { Bell } from 'lucide-react';

const AnnouncementsTab = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/investor/announcements')
            .then(res => setNews(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Bell className="text-blue-500" /> Platform Announcements
            </h2>

            <div className="space-y-6">
                {loading ? (
                    <div className="text-center text-slate-400">Loading new updates...</div>
                ) : news.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed text-slate-400">
                        No announcements at this time.
                    </div>
                ) : (
                    news.map((item) => (
                        <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                                {item.priority === 'urgent' && (
                                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold uppercase">Urgent</span>
                                )}
                                {item.priority === 'high' && (
                                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-bold uppercase">High</span>
                                )}
                            </div>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{item.content}</p>
                            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                                Posted on {new Date(item.published_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AnnouncementsTab;
