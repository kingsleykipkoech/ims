import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import DeleteModal from '../../../components/DeleteModal';
import Swal from 'sweetalert2';
import { User, Trash2, Ban, CheckCircle } from 'lucide-react';

const InvestorsTab = () => {
    const [investors, setInvestors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

    useEffect(() => {
        fetchInvestors();
    }, []);

    const fetchInvestors = () => {
        apiClient.get('/admin/investors')
            .then(res => setInvestors(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await apiClient.patch(`/admin/investor/${id}`, { status: newStatus });
            setInvestors(investors.map(inv => inv._id === id ? { ...inv, status: newStatus } : inv));
            Swal.fire({
                icon: 'success',
                title: 'Status Updated',
                text: `Investor status changed to ${newStatus}`,
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await apiClient.delete(`/admin/investor/${deleteModal.id}`);
            setInvestors(investors.filter(i => i._id !== deleteModal.id));
            setDeleteModal({ open: false, id: null, name: '' });
            Swal.fire('Deleted!', 'Investor account has been deleted.', 'success');
        } catch (err) {
            Swal.fire('Error', 'Failed to delete investor', 'error');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <User className="text-blue-500" /> Manage Investors
            </h2>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Total Invested</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {investors.map((inv) => (
                                <tr key={inv._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-bold text-slate-800">{inv.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{inv.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${inv.status === 'active' ? 'bg-green-100 text-green-700' :
                                                inv.status === 'suspended' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">${inv.total_bonds.toLocaleString()}</td>
                                    <td className="px-6 py-4 flex items-center justify-center gap-2">
                                        {inv.status === 'active' ? (
                                            <button
                                                onClick={() => handleStatusChange(inv._id, 'suspended')}
                                                className="p-2 text-orange-500 hover:bg-orange-50 rounded"
                                                title="Suspend Account"
                                            >
                                                <Ban size={18} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusChange(inv._id, 'active')}
                                                className="p-2 text-green-500 hover:bg-green-50 rounded"
                                                title="Activate Account"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setDeleteModal({ open: true, id: inv._id, name: inv.name })}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                                            title="Delete Account"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ ...deleteModal, open: false })}
                onConfirm={handleDeleteConfirm}
                title="Delete Investor Account"
                message="Are you sure you want to delete the account for"
                item={deleteModal.name}
            />
        </div>
    );
};

export default InvestorsTab;
