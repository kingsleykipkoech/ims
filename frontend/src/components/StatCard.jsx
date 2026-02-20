import React from 'react';

const StatCard = ({ title, value, icon, colorClass = "bg-blue-500", trend, trendUp }) => {
    const Icon = icon;
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start justify-between">
            <div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
                <div className="text-2xl font-bold text-slate-800">{value}</div>
                {trend && (
                    <div className={`text-xs mt-2 flex items-center font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
                <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
        </div>
    );
};

export default StatCard;
