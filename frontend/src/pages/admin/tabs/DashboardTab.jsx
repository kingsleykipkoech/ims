import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import StatCard from '../../../components/StatCard';
import { Users, Briefcase, Clock, DollarSign } from 'lucide-react';

const DashboardTab = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/admin/dashboard-stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-400">Loading stats...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Investors"
                    value={stats?.totalInvestors || 0}
                    icon={Users}
                    colorClass="bg-blue-500"
                />
                <StatCard
                    title="Total Asset Value"
                    value={`$${(stats?.totalAssetValue || 0).toLocaleString()}`}
                    icon={Briefcase}
                    colorClass="bg-purple-500"
                />
                <StatCard
                    title="Pending Approvals"
                    value={stats?.pendingApprovals || 0}
                    icon={Clock}
                    colorClass="bg-red-500"
                    trend={stats?.pendingApprovals > 0 ? "Action Required" : "All Clear"}
                />
                <StatCard
                    title="Monthly Contributions"
                    value={`$${(stats?.monthlyContributions || 0).toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="bg-green-500"
                />
            </div>

            <div className="mt-8 grid lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Placeholders for quick actions */}
                        <div className="p-4 bg-slate-50 rounded-lg text-center hover:bg-slate-100 cursor-pointer transition">
                            <div className="font-medium text-slate-700">Approve Transactions</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg text-center hover:bg-slate-100 cursor-pointer transition">
                            <div className="font-medium text-slate-700">Add New Asset</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg text-center hover:bg-slate-100 cursor-pointer transition">
                            <div className="font-medium text-slate-700">New Announcement</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg text-center hover:bg-slate-100 cursor-pointer transition">
                            <div className="font-medium text-slate-700">Generate Report</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Database Connection</span>
                            <span className="text-green-600 font-bold text-sm">Active</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Last Backup</span>
                            <span className="text-slate-500 text-sm">2 hours ago</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Server Status</span>
                            <span className="text-green-600 font-bold text-sm">Healthy</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardTab;
