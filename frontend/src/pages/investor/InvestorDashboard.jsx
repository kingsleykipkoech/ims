import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { getUser } from '../../utils/auth';
import {
    LayoutDashboard, PieChart, Briefcase, FileText,
    TrendingUp, Award, Bell, DollarSign, List, Activity
} from 'lucide-react';

// Tab Components
import OverviewTab from './tabs/OverviewTab';
import AssetsTab from './tabs/AssetsTab';
import AssetOwnershipTab from './tabs/AssetOwnershipTab';
import BondsTab from './tabs/BondsTab';
import BondContributionsTab from './tabs/BondContributionsTab';
import ContributionsTab from './tabs/ContributionsTab';
import InterestTab from './tabs/InterestTab';
import YearlyTransactionsTab from './tabs/YearlyTransactionsTab';
import RankingsTab from './tabs/RankingsTab';
import AnnouncementsTab from './tabs/AnnouncementsTab';

// Links configuration
const NAV_LINKS = [
    { path: '/investor', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/investor/assets', label: 'Assets', icon: Briefcase },
    { path: '/investor/my-assets', label: 'My Ownership', icon: PieChart },
    { path: '/investor/bonds', label: 'Bonds', icon: FileText },
    { path: '/investor/bond-contributions', label: 'Bond History', icon: List },
    { path: '/investor/contributions', label: 'Contributions', icon: DollarSign },
    { path: '/investor/interest', label: 'Interest', icon: TrendingUp },
    { path: '/investor/transactions', label: 'Yearly Report', icon: Activity },
    { path: '/investor/rankings', label: 'Rankings', icon: Award },
    { path: '/investor/announcements', label: 'Announcements', icon: Bell },
];

const InvestorDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = getUser();

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar
                title="Investor Panel"
                links={NAV_LINKS}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                user={user}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
                    <div className="font-bold text-lg text-slate-800">IMS</div>
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
                        <Route path="/" element={<OverviewTab />} />
                        <Route path="/assets" element={<AssetsTab />} />
                        <Route path="/my-assets" element={<AssetOwnershipTab />} />
                        <Route path="/bonds" element={<BondsTab />} />
                        <Route path="/bond-contributions" element={<BondContributionsTab />} />
                        <Route path="/contributions" element={<ContributionsTab />} />
                        <Route path="/interest" element={<InterestTab />} />
                        <Route path="/transactions" element={<YearlyTransactionsTab />} />
                        <Route path="/rankings" element={<RankingsTab />} />
                        <Route path="/announcements" element={<AnnouncementsTab />} />
                        <Route path="*" element={<Navigate to="/investor" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default InvestorDashboard;
