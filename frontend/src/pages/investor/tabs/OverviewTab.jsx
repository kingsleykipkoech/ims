import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import StatCard from '../../../components/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Briefcase, TrendingUp, Activity } from 'lucide-react';
import { getUser } from '../../../utils/auth';

const OverviewTab = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const user = getUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, txRes] = await Promise.all([
                    apiClient.get('/investor/profile'),
                    apiClient.get('/investor/transactions')
                ]);
                setProfile(profileRes.data);
                setTransactions(txRes.data.filter(t => t.type === 'contribution' && t.status === 'approved'));
            } catch (err) {
                console.error('Error fetching overview data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate cumulative growth for chart
    const getChartData = () => {
        if (!transactions.length) return [];

        // Sort by date
        const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

        let cumulative = 0;
        return sorted.map(t => {
            cumulative += t.amount;
            return {
                date: new Date(t.date).toLocaleDateString(),
                amount: cumulative,
            };
        });
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name}</h1>
                    <p className="text-slate-500">Here's what's happening with your portfolio today.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-400">Total Portfolio Value</p>
                    <p className="text-3xl font-bold text-blue-600">
                        ${(profile?.total_bonds || 0).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Contribution"
                    value={`$${(profile?.total_bonds || 0).toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="bg-blue-500"
                />
                <StatCard
                    title="Percentage Share"
                    value={`${profile?.percentage_share || 0}%`}
                    icon={Activity}
                    colorClass="bg-purple-500"
                />
                <StatCard
                    title="Active Assets"
                    value="4" // Mock for now, requires asset count endpoint
                    icon={Briefcase}
                    colorClass="bg-teal-500"
                />
                <StatCard
                    title="Total Interest"
                    value="$0.00" // Mock
                    icon={TrendingUp}
                    colorClass="bg-green-500"
                    trend="+12% this month"
                    trendUp={true}
                />
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Portfolio Growth</h3>
                    {transactions.length > 0 ? (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={getChartData()}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
                            No contribution history available to display graph.
                        </div>
                    )}
                </div>

                {/* Recent Activity / Announcements */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {transactions.slice(0, 5).map((t, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === 'contribution' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {t.type === 'contribution' ? <DollarSign size={18} /> : <TrendingUp size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 capitalize">{t.type}</p>
                                    <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                                <div className="font-bold text-slate-700">
                                    +${t.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-4">No recent transactions</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
