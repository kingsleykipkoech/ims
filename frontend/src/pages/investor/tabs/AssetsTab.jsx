import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import { Search, Filter, TrendingUp } from 'lucide-react';

const AssetsTab = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await apiClient.get('/assets');
                setAssets(res.data);
            } catch (err) {
                console.error('Failed to fetch assets');
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Available Assets</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading assets...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssets.map((asset) => (
                        <div key={asset._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                            <div className="h-32 bg-slate-100 relative group">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                    {/* Placeholder for asset image if we had one */}
                                    <TrendingUp size={48} />
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-medium cursor-pointer">
                                    View Details
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">{asset.name}</h3>
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
                                        ${asset.value.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                                    {asset.description || 'No description available for this asset.'}
                                </p>
                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Added: {new Date(asset.created_at).toLocaleDateString()}</span>
                                    {asset.document && (
                                        <button className="text-blue-600 hover:underline">Download Docs</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredAssets.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            No assets found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AssetsTab;
