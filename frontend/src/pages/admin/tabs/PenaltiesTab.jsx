import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import Swal from 'sweetalert2';
import { AlertCircle, UserMinus } from 'lucide-react';

const PenaltiesTab = () => {
    const [penalties, setPenalties] = useState([]);
    const [investors, setInvestors] = useState([]);
    const [formData, setFormData] = useState({
        investor_id: '',
        amount: '',
        reason: ''
    });

    const fetchPenalties = () => {
        apiClient.get('/penalties')
            .then(res => setPenalties(res.data))
            .catch(err => console.error(err));
    };

    const fetchInvestors = () => {
        apiClient.get('/admin/investors')
            .then(res => setInvestors(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchPenalties();
        fetchInvestors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/penalties', formData);
            Swal.fire('Success', 'Penalty applied successfully', 'success');
            setFormData({ investor_id: '', amount: '', reason: '' });
            fetchPenalties();
        } catch {
            Swal.fire('Error', 'Failed to apply penalty', 'error');
        }
    };

    return (
        <div className="p-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <UserMinus size={20} className="text-orange-500" /> Apply Penalty
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Investor</label>
                            <select
                                required
                                value={formData.investor_id}
                                onChange={e => setFormData({ ...formData, investor_id: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                            >
                                <option value="">Select Investor</option>
                                {investors.map(inv => (
                                    <option key={inv._id} value={inv._id}>{inv.name} ({inv.email})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Penalty Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Reason</label>
                            <textarea
                                required
                                rows="3"
                                value={formData.reason}
                                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                            />
                        </div>
                        <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg transition shadow-lg shadow-orange-500/20">
                            Apply Penalty
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <h2 className="font-bold text-slate-800">Penalty Records</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Investor</th>
                                <th className="px-6 py-3">Reason</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {penalties.map(p => (
                                <tr key={p._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 text-slate-500">{new Date(p.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-3 font-medium text-slate-800">{p.investor_id?.name || 'Unknown'}</td>
                                    <td className="px-6 py-3 text-slate-500">{p.reason}</td>
                                    <td className="px-6 py-3 text-right font-bold text-orange-600">-${p.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                            {penalties.length === 0 && (
                                <tr><td colSpan="4" className="p-6 text-center text-slate-400">No penalties applied.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PenaltiesTab;
