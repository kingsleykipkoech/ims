import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import DeleteModal from '../../../components/DeleteModal';
import Swal from 'sweetalert2';
import { FileText, Plus, Trash2, X } from 'lucide-react';

const AdminBondsTab = () => {
    const [bonds, setBonds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        interest_rate: '',
        term: '', // in months
        maturity_date: ''
    });

    const fetchBonds = () => {
        apiClient.get('/bonds')
            .then(res => setBonds(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBonds();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/bonds', formData);
            Swal.fire('Success', 'Bond created successfully', 'success');
            setIsModalOpen(false);
            setFormData({ name: '', description: '', interest_rate: '', term: '', maturity_date: '' });
            fetchBonds();
        } catch {
            Swal.fire('Error', 'Failed to create bond', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`/bonds/${deleteModal.id}`);
            setBonds(bonds.filter(b => b._id !== deleteModal.id));
            setDeleteModal({ open: false, id: null, name: '' });
            Swal.fire('Deleted', 'Bond removed', 'success');
        } catch {
            Swal.fire('Error', 'Failed to delete bond', 'error');
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-slate-500">Loading bonds...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-amber-500" /> Manage Bonds
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-lg shadow-amber-500/30"
                >
                    <Plus size={18} /> New Bond
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bonds.map((bond) => (
                    <div key={bond._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative group">
                        <button
                            onClick={() => setDeleteModal({ open: true, id: bond._id, name: bond.name })}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                            <Trash2 size={18} />
                        </button>

                        <h3 className="text-lg font-bold text-slate-800">{bond.name}</h3>
                        <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{bond.description}</p>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-500">Interest Rate</span>
                            <span className="font-bold text-slate-800">{bond.interest_rate}%</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-500">Term</span>
                            <span className="font-bold text-slate-800">{bond.term} Months</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* New Bond Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800">Create New Bond</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input type="text" name="name" placeholder="Bond Name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
                            <textarea name="description" placeholder="Description" rows="3" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" name="interest_rate" placeholder="Interest Rate %" required value={formData.interest_rate} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
                                <input type="number" name="term" placeholder="Term (Months)" required value={formData.term} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <input type="date" name="maturity_date" placeholder="Maturity Date" className="w-full px-4 py-2 border rounded-lg" value={formData.maturity_date} onChange={handleInputChange} />

                            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg">Create Bond</button>
                        </form>
                    </div>
                </div>
            )}

            <DeleteModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ ...deleteModal, open: false })}
                onConfirm={handleDelete}
                title="Delete Bond"
                message="Are you sure you want to delete bond"
                item={deleteModal.name}
            />
        </div>
    );
};

export default AdminBondsTab;
