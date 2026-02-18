import React, { useState } from 'react';
import apiClient from '../../../apiClient';
import { FileText, Download, Calendar } from 'lucide-react';

const ReportsTab = () => {
    const [reportType, setReportType] = useState('monthly_contributions');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);

    const generateReport = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // In a real app, this would likely download a PDF or CSV
            // For now, we'll fetch JSON data to display
            const res = await apiClient.get(`/admin/reports/${reportType}`, {
                params: dateRange
            });
            setReportData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = () => {
        // Mock download function
        alert("Download functionality would be implemented here (e.g., generating PDF/CSV).");
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="text-blue-500" /> Financial Reports
            </h2>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <form onSubmit={generateReport} className="grid md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Report Type</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="monthly_contributions">Monthly Contributions</option>
                            <option value="yearly_contributions">Yearly Contributions</option>
                            <option value="asset_performance">Asset Performance</option>
                            <option value="interest_distribution">Interest Distribution</option>
                            <option value="investor_activity">Investor Activity</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">End Date</label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-lg shadow-blue-500/30 h-10 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Generating...' : 'Generate Report'}
                    </button>
                </form>
            </div>

            {reportData && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Calendar size={18} className="text-slate-400" /> Report Preview
                        </h3>
                        <button
                            onClick={downloadReport}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                        >
                            <Download size={16} /> Download CSV
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-sm text-slate-600 overflow-auto max-h-96">
                            <pre>{JSON.stringify(reportData, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsTab;
