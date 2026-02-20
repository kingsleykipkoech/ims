import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import Swal from 'sweetalert2';
import { Upload, File, Trash2, Link } from 'lucide-react';

const AdminDocumentsTab = () => {
    const [documents, setDocuments] = useState([]);
    const [assets, setAssets] = useState([]);
    const [uploadData, setUploadData] = useState({ asset_id: '', file: null });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDocuments();
        fetchAssets();
    }, []);

    const fetchDocuments = () => {
        // Assuming an endpoint exists or we fetch assets and extract docs
        apiClient.get('/admin/documents')
            .then(res => setDocuments(res.data))
            .catch(err => console.error(err));
    };

    const fetchAssets = () => {
        apiClient.get('/assets').then(res => setAssets(res.data));
    };

    const handleFileChange = (e) => {
        setUploadData({ ...uploadData, file: e.target.files[0] });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadData.file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('document', uploadData.file);
        if (uploadData.asset_id) formData.append('asset_id', uploadData.asset_id);

        try {
            await apiClient.post('/admin/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire('Success', 'Document uploaded successfully', 'success');
            setUploadData({ asset_id: '', file: null });
            fetchDocuments();
        } catch {
            Swal.fire('Error', 'Upload failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Upload size={20} className="text-purple-500" /> Upload Document
                    </h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Link to Asset (Optional)</label>
                            <select
                                value={uploadData.asset_id}
                                onChange={e => setUploadData({ ...uploadData, asset_id: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                            >
                                <option value="">-- General Document --</option>
                                {assets.map(asset => (
                                    <option key={asset._id} value={asset._id}>{asset.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer relative">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-slate-500">
                                {uploadData.file ? (
                                    <span className="text-purple-600 font-medium">{uploadData.file.name}</span>
                                ) : (
                                    <span>Click to select file</span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !uploadData.file}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
                        >
                            {loading ? 'Uploading...' : 'Upload Now'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <h2 className="font-bold text-slate-800">Document Library</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Details</th>
                                <th className="px-6 py-3">Related Asset</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {documents.map(doc => (
                                <tr key={doc._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 p-2 rounded text-purple-600">
                                                <File size={16} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-800">{doc.originalName}</div>
                                                <div className="text-xs text-slate-400">{new Date(doc.uploadDate).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-slate-600">
                                        {doc.asset_id?.name ? (
                                            <span className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded w-fit">
                                                <Link size={10} /> {doc.asset_id.name}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button className="text-red-500 hover:bg-red-50 p-2 rounded transition">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {documents.length === 0 && (
                                <tr><td colSpan="3" className="p-6 text-center text-slate-400">No documents uploaded.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDocumentsTab;
