import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import Swal from 'sweetalert2';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, Trash2 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminOwnershipTab = () => {
    const [ownerships, setOwnerships] = useState([]);
    const [assets, setAssets] = useState([]);
    const [investors, setInvestors] = useState([]);

    const [formData, setFormData] = useState({
        investor_id: '',
        asset_id: '',
        percentage_share: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ownRes, assetsRes, invRes] = await Promise.all([
                    apiClient.get('/admin/asset-ownership'),
                    apiClient.get('/assets'),
                    apiClient.get('/admin/investors')
                ]);
                setOwnerships(ownRes.data);
                setAssets(assetsRes.data);
                setInvestors(invRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/admin/asset-ownership', formData);
            Swal.fire('Success', 'Ownership assigned', 'success');
            setFormData({ investor_id: '', asset_id: '', percentage_share: '' });
            window.location.reload();
        } catch {
            Swal.fire('Error', 'Assignment failed', 'error');
        }
    };

    return (
        <div className="p-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Plus size={20} className="text-blue-500" /> Assign Ownership
                    </h2>
                    <form onSubmit={handleAssign} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Asset</label>
                            <select
                                required
                                value={formData.asset_id}
                                onChange={e => setFormData({ ...formData, asset_id: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="">Select Asset</option>
                                {assets.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Investor</label>
                            <select
                                required
                                value={formData.investor_id}
                                onChange={e => setFormData({ ...formData, investor_id: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="">Select Investor</option>
                                {investors.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Percentage Share (%)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="100"
                                value={formData.percentage_share}
                                onChange={e => setFormData({ ...formData, percentage_share: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">
                            Assign Share
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <h2 className="font-bold text-slate-800">Current Allocations</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Asset</th>
                                <th className="px-6 py-3">Investor</th>
                                <th className="px-6 py-3">Share</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {ownerships.map(o => (
                                <tr key={o._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium text-slate-800">{o.asset_id?.name}</td>
                                    <td className="px-6 py-3 text-slate-600">{o.investor_id?.name}</td>
                                    <td className="px-6 py-3 text-blue-600 font-bold">{o.percentage_share}%</td>
                                    <td className="px-6 py-3 text-right">
                                        <button className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {ownerships.length === 0 && (
                                <tr><td colSpan="4" className="p-6 text-center text-slate-400">No ownership records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOwnershipTab;
