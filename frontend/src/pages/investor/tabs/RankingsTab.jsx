import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import { Award } from 'lucide-react';

const RankingsTab = () => {
    const [investors, setInvestors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/investor/rankings')
            .then(res => setInvestors(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-slate-500">Loading rankings...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
                    <Award className="text-amber-500 w-8 h-8" /> Investor Rankings
                </h2>
                <p className="text-slate-500">Top contributors in our investment community</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white">
                        <tr>
                            <th className="px-6 py-4 w-16 text-center">Rank</th>
                            <th className="px-6 py-4">Investor</th>
                            <th className="px-6 py-4 text-center">Share %</th>
                            <th className="px-6 py-4 text-right">Total Contributed</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {investors.map((inv, index) => (
                            <tr
                                key={inv._id}
                                className={`
                  hover:bg-slate-50 transition 
                  ${index === 0 ? 'bg-amber-50' : ''} 
                  ${index === 1 ? 'bg-slate-50' : ''}
                  ${index === 2 ? 'bg-orange-50' : ''}
                `}
                            >
                                <td className="px-6 py-4 text-center font-bold text-slate-500">
                                    {index === 0 && '🥇'}
                                    {index === 1 && '🥈'}
                                    {index === 2 && '🥉'}
                                    {index > 2 && `#${index + 1}`}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800">{inv.name}</div>
                                    <div className="text-xs text-slate-400">Joined {new Date(inv.date_of_joining).getFullYear()}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
                                        {inv.percentage_share}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-700">
                                    ${inv.total_bonds.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RankingsTab;
