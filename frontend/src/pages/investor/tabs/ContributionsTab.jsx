import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import Swal from 'sweetalert2';
import { DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

const ContributionsTab = () => {
    const [amount, setAmount] = useState('');
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assetsRes, txRes] = await Promise.all([
                apiClient.get('/assets'),
                apiClient.get('/investor/transactions')
            ]);
            setAssets(assetsRes.data);
            setTransactions(txRes.data.filter(t => t.type === 'contribution'));
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const handleContribute = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) return;

        setLoading(true);
        try {
            await apiClient.post('/investor/contribute', {
                amount: Number(amount),
                asset_id: selectedAsset || null, // Optional asset linking
            });

            Swal.fire({
                icon: 'success',
                title: 'Contribution Submitted',
                text: 'Your contribution is pending admin approval.',
                timer: 2000,
                showConfirmButton: false
            });

            setAmount('');
            setSelectedAsset('');
            fetchData(); // Refresh list
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: err.response?.data?.message || 'Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle size={12} /> Approved</span>;
            case 'rejected': return <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold"><XCircle size={12} /> Rejected</span>;
            default: return <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold"><Clock size={12} /> Pending</span>;
        }
    };

    return (
        <div className="p-6 grid lg:grid-cols-3 gap-6">
            {/* Submission Form */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <DollarSign className="text-blue-500" /> New Contribution
                    </h2>
                    <form onSubmit={handleContribute} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Contribution Amount ($)
                            </label>
                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Link to Asset (Optional)
                            </label>
                            <select
                                value={selectedAsset}
                                onChange={(e) => setSelectedAsset(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                            >
                                <option value="">-- General Contribution --</option>
                                {assets.map(asset => (
                                    <option key={asset._id} value={asset._id}>{asset.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-400 mt-1">
                                Select an asset if this investment is for a specific item.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/30 transition duration-300 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : 'Submit Contribution'}
                        </button>
                    </form>
                </div>
            </div>

            {/* History Table */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">Contribution History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Asset / Type</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {tx.asset_id?.name || 'General Contribution'}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-800">
                                            ${tx.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(tx.status)}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                            No contribution history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContributionsTab;
