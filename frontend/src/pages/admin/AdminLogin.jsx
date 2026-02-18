import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../apiClient';
import { setToken, setUser } from '../../utils/auth';
import Swal from 'sweetalert2';
import { Lock, Mail, Shield, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await apiClient.post('/auth/login/admin', formData);

            setToken(data.accessToken, data.refreshToken);
            setUser(data.user);

            Swal.fire({
                icon: 'success',
                title: 'Admin Access Granted',
                timer: 1500,
                showConfirmButton: false,
            });

            const from = location.state?.from?.pathname || '/admin';
            navigate(from, { replace: true });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: err.response?.data?.message || 'Invalid credentials',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-700">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                        <Shield className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
                    <p className="text-slate-400 mt-2">Restricted access area</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Admin Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-500/20 transition duration-300 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Authenticating...' : 'Enter Dashboard'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
