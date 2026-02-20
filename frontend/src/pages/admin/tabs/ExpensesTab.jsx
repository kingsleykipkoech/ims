import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import Swal from 'sweetalert2';
import { DollarSign, Plus } from 'lucide-react';

const ExpensesTab = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchExpenses = () => {
        apiClient.get('/expenses')
            .then(res => setExpenses(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/expenses', formData);
            Swal.fire('Success', 'Expense recorded', 'success');
            setFormData({
                category: '',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            fetchExpenses();
        } catch {
            Swal.fire('Error', 'Failed to record expense', 'error');
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-slate-500">Loading expenses...</div>;
    }

    return (
        <div className="p-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Plus size={20} className="text-red-500" /> Record Expense
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., Server Maintenance"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                            <textarea
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
                            />
                        </div>
                        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition shadow-lg shadow-red-500/20">
                            Add Expense
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <h2 className="font-bold text-slate-800">Expense History</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {expenses.map(exp => (
                                <tr key={exp._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 text-slate-500">{new Date(exp.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-3 font-medium text-slate-800">{exp.category}</td>
                                    <td className="px-6 py-3 text-slate-500">{exp.description}</td>
                                    <td className="px-6 py-3 text-right font-bold text-red-600">-${exp.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr><td colSpan="4" className="p-6 text-center text-slate-400">No expenses recorded.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpensesTab;
