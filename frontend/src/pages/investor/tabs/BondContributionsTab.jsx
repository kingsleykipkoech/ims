import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import { List } from 'lucide-react';

const BondContributionsTab = () => {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/investor/bonds')
            .then(res => setContributions(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <List className="text-blue-500" /> Bond Contributions History
            </h2>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Bond Name</th>
                                <th className="px-6 py-4">Interest Rate</th>
                                <th className="px-6 py-4">Maturity Date</th>
                                <th className="px-6 py-4 text-right">Amount Invested</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="p-6 text-center text-slate-400">Loading...</td></tr>
                            ) : contributions.length === 0 ? (
                                <tr><td colSpan="5" className="p-6 text-center text-slate-400">No bond contributions found.</td></tr>
                            ) : (
                                contributions.map((c) => (
                                    <tr key={c._id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-slate-600">{new Date(c.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{c.bond_id?.name || 'Unknown Bond'}</td>
                                        <td className="px-6 py-4">{c.bond_id?.interest_rate}%</td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {c.bond_id?.maturity_date ? new Date(c.bond_id.maturity_date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-800">${c.amount.toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BondContributionsTab;
