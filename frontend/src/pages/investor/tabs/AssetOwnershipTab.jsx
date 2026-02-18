import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Briefcase } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AssetOwnershipTab = () => {
    const [ownerships, setOwnerships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/investor/asset-ownership')
            .then(res => setOwnerships(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const chartData = ownerships.map(o => ({
        name: o.asset_id.name,
        value: (o.percentage_share / 100) * o.asset_id.value
    }));

    if (loading) return <div className="p-8 text-center text-slate-400">Loading ownership data...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">My Asset Ownership</h2>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* List */}
                <div className="space-y-4">
                    {ownerships.map((o) => (
                        <div key={o._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{o.asset_id.name}</h3>
                                    <p className="text-sm text-slate-500">
                                        Total Asset Value: ${o.asset_id.value.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-medium text-slate-500">Your Share</div>
                                <div className="text-xl font-bold text-blue-600">{o.percentage_share}%</div>
                                <div className="text-xs text-slate-400">
                                    Value: ${((o.percentage_share / 100) * o.asset_id.value).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                    {ownerships.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                            You don't own any direct assets yet.
                        </div>
                    )}
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Portfolio Allocation</h3>
                    {ownerships.length > 0 ? (
                        <div className="w-full h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="text-slate-400">No data for visualization</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssetOwnershipTab;
