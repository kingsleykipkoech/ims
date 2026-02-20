import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import { Activity } from 'lucide-react';

const YearlyTransactionsTab = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // We'll reuse the transactions endpoint but group locally 
    // since the specific report route might be admin only or we can use the main one.
    // Actually, let's just show a full table of all transactions for now.

    useEffect(() => {
        apiClient.get('/investor/transactions')
            .then(res => setData(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-slate-500">Loading transactions...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Activity className="text-slate-600" /> Transaction Report
            </h2>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Reference ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((row) => (
                                <tr key={row._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                        {row._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(row.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 capitalize font-medium text-slate-700">
                                        {row.type}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {row.asset_id?.name || 'General'}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${row.type === 'contribution' ? 'text-blue-600' : 'text-green-600'
                                        }`}>
                                        ${row.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${row.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            row.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400">No transaction data available yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default YearlyTransactionsTab;
