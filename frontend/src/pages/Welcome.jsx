import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, ShieldCheck, PieChart } from 'lucide-react';

const Welcome = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white font-sans">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                    IMS Platform
                </div>
                <div className="space-x-4">
                    <Link to="/login" className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition">
                        Investor Login
                    </Link>
                    <Link to="/admin-login" className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-500/30">
                        Admin Portal
                    </Link>
                </div>
            </nav>

            <header className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
                    Smart Investment <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                        Management System
                    </span>
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
                    Track assets, monitor bonds, and manage your portfolio with real-time analytics and bank-grade security.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/login" className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold hover:bg-blue-50 transition flex items-center gap-2">
                        Get Started <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </header>

            <section className="container mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition duration-300">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
                    <p className="text-slate-400">Visualize your portfolio performance with interactive charts and detailed breakdown of your assets.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-teal-500/50 transition duration-300">
                    <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                        <ShieldCheck className="w-6 h-6 text-teal-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Secure & Compliance</h3>
                    <p className="text-slate-400">Bank-grade security with JWT authentication and comprehensive audit trails for all transactions.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition duration-300">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                        <PieChart className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Asset Diversification</h3>
                    <p className="text-slate-400">Manage a diverse portfolio including bonds, direct asset ownership, and interest-bearing accounts.</p>
                </div>
            </section>

            <footer className="border-t border-white/10 py-8 text-center text-slate-500">
                <p>© 2026 Investment Management System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Welcome;
