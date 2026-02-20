import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import DeleteModal from '../../../components/DeleteModal';
import Swal from 'sweetalert2';
import { Briefcase, Plus, Edit, Trash2, FileText, X } from 'lucide-react';

const AdminAssetsTab = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        value: '',
        description: '',
        document: null // file object
    });

    const fetchAssets = () => {
        apiClient.get('/assets')
            .then(res => setAssets(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, document: e.target.files[0] });
    };

    const openModal = (asset = null) => {
        if (asset) {
            setEditingAsset(asset);
            setFormData({
                name: asset.name,
                value: asset.value,
                description: asset.description || '',
                document: null
            });
        } else {
            setEditingAsset(null);
            setFormData({ name: '', value: '', description: '', document: null });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('value', formData.value);
        data.append('description', formData.description);
        if (formData.document) {
            data.append('document', formData.document);
        }

        try {
            if (editingAsset) {
                await apiClient.put(`/assets/item/${editingAsset._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire('Success', 'Asset updated successfully', 'success');
            } else {
                await apiClient.post('/assets', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire('Success', 'Asset created successfully', 'success');
            }
            setIsModalOpen(false);
            fetchAssets();
        } catch {
            Swal.fire('Error', 'Operation failed', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`/assets/item/${deleteModal.id}`);
            setAssets(assets.filter(a => a._id !== deleteModal.id));
            setDeleteModal({ open: false, id: null, name: '' });
            Swal.fire('Deleted!', 'Asset has been removed.', 'success');
        } catch {
            Swal.fire('Error', 'Failed to delete asset', 'error');
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-slate-500">Loading assets...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Briefcase className="text-blue-500" /> Manage Assets
                </h2>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-lg shadow-blue-500/30"
                >
                    <Plus size={18} /> Add New Asset
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                    <div key={asset._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative group hover:shadow-md transition">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button
                                onClick={() => openModal(asset)}
                                className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-blue-100 hover:text-blue-600"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => setDeleteModal({ open: true, id: asset._id, name: asset.name })}
                                className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-red-100 hover:text-red-600"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mb-1">{asset.name}</h3>
                        <p className="text-2xl font-bold text-blue-600 mb-4">${asset.value.toLocaleString()}</p>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{asset.description}</p>

                        {asset.document && (
                            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-2 rounded">
                                <FileText size={14} /> Document Attached
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Asset Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800">
                                {editingAsset ? 'Edit Asset' : 'Create New Asset'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Asset Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Value ($)</label>
                                <input
                                    type="number"
                                    name="value"
                                    required
                                    value={formData.value}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Document (Optional)</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                                >
                                    {editingAsset ? 'Update Asset' : 'Create Asset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ ...deleteModal, open: false })}
                onConfirm={handleDelete}
                title="Delete Asset"
                message="Are you sure you want to delete"
                item={deleteModal.name}
            />
        </div>
    );
};

export default AdminAssetsTab;
