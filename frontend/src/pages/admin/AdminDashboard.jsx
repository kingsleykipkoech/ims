import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { getUser } from '../../utils/auth';
import {
    LayoutDashboard, Users, Briefcase, FileText,
    CreditCard, TrendingUp, DollarSign, AlertCircle,
    PieChart, BarChart2, Bell, Upload, List
} from 'lucide-react';

// Admin Tabs
import DashboardTab from './tabs/DashboardTab';
import InvestorsTab from './tabs/InvestorsTab';
import AdminAssetsTab from './tabs/AdminAssetsTab';
import AdminBondsTab from './tabs/AdminBondsTab';
import TransactionsTab from './tabs/TransactionsTab';
import InterestRatesTab from './tabs/InterestRatesTab';
import ExpensesTab from './tabs/ExpensesTab';
import PenaltiesTab from './tabs/PenaltiesTab';
import AdminOwnershipTab from './tabs/AdminOwnershipTab';
import AdminAnnouncementsTab from './tabs/AdminAnnouncementsTab';
import ReportsTab from './tabs/ReportsTab';
import AdminDocumentsTab from './tabs/AdminDocumentsTab';

const NAV_LINKS = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/admin/investors', label: 'Investors', icon: Users },
    { path: '/admin/assets', label: 'Assets', icon: Briefcase },
    { path: '/admin/bonds', label: 'Bonds', icon: FileText },
    { path: '/admin/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/admin/interest-rates', label: 'Interest Rates', icon: TrendingUp },
    { path: '/admin/expenses', label: 'Expenses', icon: DollarSign },
    { path: '/admin/penalties', label: 'Penalties', icon: AlertCircle },
    { path: '/admin/ownership', label: 'Ownership', icon: PieChart },
    { path: '/admin/reports', label: 'Reports', icon: BarChart2 },
    { path: '/admin/announcements', label: 'Announcements', icon: Bell },
    { path: '/admin/documents', label: 'Documents', icon: Upload },
];

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = getUser();

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">
            <Sidebar
                title="Admin Portal"
                links={NAV_LINKS}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                user={user}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
                    <div className="font-bold text-lg text-slate-800">IMS Admin</div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-md hover:bg-slate-100"
                    >
                        <List size={24} />
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    <Routes>
                        <Route path="/" element={<DashboardTab />} />
                        <Route path="/investors" element={<InvestorsTab />} />
                        <Route path="/assets" element={<AdminAssetsTab />} />
                        <Route path="/bonds" element={<AdminBondsTab />} />
                        <Route path="/transactions" element={<TransactionsTab />} />
                        <Route path="/interest-rates" element={<InterestRatesTab />} />
                        <Route path="/expenses" element={<ExpensesTab />} />
                        <Route path="/penalties" element={<PenaltiesTab />} />
                        <Route path="/ownership" element={<AdminOwnershipTab />} />
                        <Route path="/reports" element={<ReportsTab />} />
                        <Route path="/announcements" element={<AdminAnnouncementsTab />} />
                        <Route path="/documents" element={<AdminDocumentsTab />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
