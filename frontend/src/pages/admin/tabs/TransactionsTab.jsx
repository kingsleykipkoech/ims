import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import Swal from 'sweetalert2';
import { CreditCard, Check, X, Clock, Filter } from 'lucide-react';

const TransactionsTab = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchTransactions = () => {
        apiClient.get('/admin/transactions')
            .then(res => setTransactions(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleApproval = async (id, status) => {
        try {
            if (status === 'rejected') {
                const { value: reason } = await Swal.fire({
                    title: 'Reject Transaction',
                    input: 'text',
                    inputLabel: 'Reason for rejection',
                    inputPlaceholder: 'Enter reason...',
                    showCancelButton: true
                });
                if (!reason) return; // Cancelled
            }

            await apiClient.patch(`/admin/transactions/${id}`, { status });

            // Update local state
            setTransactions(prev => prev.map(t =>
                t._id === id ? { ...t, status } : t
            ));

            Swal.fire({
                icon: 'success',
                title: `Transaction ${status}`,
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err) {
            console.error(err);

            Swal.fire('Error', 'Failed to update transaction', 'error');
        }
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        return t.status === filter;
    });

    if (loading) {
        return <div className="p-10 text-center text-slate-500">Loading transactions...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <CreditCard className="text-blue-500" /> Transaction Management
                </h2>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['all', 'pending', 'approved', 'rejected'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition ${filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Investor</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Asset / Desc</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">{tx.investor_id?.name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-400">{tx.investor_id?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 capitalize">{tx.type}</td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {tx.asset_id?.name || 'General'}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${tx.type === 'contribution' ? 'text-blue-600' : 'text-green-600'
                                        }`}>
                                        ${tx.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${tx.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            tx.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center justify-center gap-2">
                                        {tx.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApproval(tx._id, 'approved')}
                                                    className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition"
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleApproval(tx._id, 'rejected')}
                                                    className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                                                    title="Reject"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400">
                                        No transactions found for this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionsTab;
