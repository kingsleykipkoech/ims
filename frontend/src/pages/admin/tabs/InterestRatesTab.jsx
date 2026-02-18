import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import Swal from 'sweetalert2';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';

const InterestRatesTab = () => {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        rate_percentage: '',
        category: '',
        effective_date: ''
    });

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = () => {
        apiClient.get('/interest-rates')
            .then(res => setRates(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/interest-rates', formData);
            Swal.fire('Success', 'Interest Rate configured', 'success');
            setFormData({ rate_percentage: '', category: '', effective_date: '' });
            fetchRates();
        } catch (err) {
            Swal.fire('Error', 'Failed to add interest rate', 'error');
        }
    };

    return (
        <div className="p-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Plus size={20} className="text-blue-500" /> New Rate Config
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Percentage (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.rate_percentage}
                                onChange={e => setFormData({ ...formData, rate_percentage: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                            <select
                                required
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="">Select Category</option>
                                <option value="bonds">Bonds</option>
                                <option value="savings">Savings</option>
                                <option value="contributions">Contributions</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Effective Date</label>
                            <input
                                type="date"
                                required
                                value={formData.effective_date}
                                onChange={e => setFormData({ ...formData, effective_date: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">
                            Set Rate
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800">Active Rates</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Rate</th>
                                <th className="px-6 py-3">Effective</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rates.map(rate => (
                                <tr key={rate._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 capitalize font-medium">{rate.category}</td>
                                    <td className="px-6 py-3 font-bold text-blue-600">{rate.rate_percentage}%</td>
                                    <td className="px-6 py-3 text-slate-500">{new Date(rate.effective_date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {rates.length === 0 && (
                                <tr><td colSpan="3" className="p-6 text-center text-slate-400">No rates configured yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InterestRatesTab;
