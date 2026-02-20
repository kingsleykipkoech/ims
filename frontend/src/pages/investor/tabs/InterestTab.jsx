import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const InterestTab = () => {
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/investor/interest')
            .then(res => setInterests(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const totalInterest = interests.reduce((sum, i) => sum + i.amount, 0);

    if (loading) {
        return <div className="p-10 text-center text-slate-500">Loading interest data...</div>;
    }

    const chartData = interests.map(i => ({
        date: new Date(i.date).toLocaleDateString(),
        amount: i.amount
    })).reverse(); // Show oldest to newest

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="text-green-500" /> Interest Earnings
                </h2>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold">
                    Total Earned: ${totalInterest.toLocaleString()}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Earnings Over Time</h3>
                    {interests.length > 0 ? (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" fontSize={12} stroke="#94a3b8" />
                                    <YAxis fontSize={12} stroke="#94a3b8" tickFormatter={val => `$${val}`} />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                    <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-slate-400">
                            No interest data to visualize.
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 font-bold text-slate-800">Recent Payouts</div>
                    <div className="flex-1 overflow-y-auto max-h-96">
                        {interests.length === 0 ? (
                            <div className="p-6 text-center text-slate-400">No interest payouts yet.</div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <tbody className="divide-y divide-slate-100">
                                    {interests.map((i) => (
                                        <tr key={i._id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-slate-600">{new Date(i.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-right font-bold text-green-600">+${i.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterestTab;
