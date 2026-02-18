import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import apiClient from '../../apiClient';
import { setToken, setUser } from '../../utils/auth';
import Swal from 'sweetalert2';
import { User, Lock, Mail, CreditCard, ArrowRight } from 'lucide-react';

const Login = ({ isRegister = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        national_id_number: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegister) {
                await apiClient.post('/auth/register', formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: 'Please login with your credentials.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                navigate('/login');
            } else {
                const { data } = await apiClient.post('/auth/login/investor', {
                    email: formData.email,
                    password: formData.password,
                });

                setToken(data.accessToken, data.refreshToken);
                setUser(data.user);

                Swal.fire({
                    icon: 'success',
                    title: 'Welcome back!',
                    text: `Logged in as ${data.user.name}`,
                    timer: 1500,
                    showConfirmButton: false,
                });

                const from = location.state?.from?.pathname || '/investor';
                navigate(from, { replace: true });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Failed',
                text: err.response?.data?.message || 'Something went wrong. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col md:flex-row">
                <div className="w-full p-8 md:p-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-800">
                            {isRegister ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {isRegister ? 'Join our investment platform today' : 'Access your investor portfolio'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isRegister && (
                            <>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                    />
                                </div>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="national_id_number"
                                        placeholder="National ID Number"
                                        value={formData.national_id_number}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                    />
                                </div>
                            </>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/30 transition duration-300 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : (isRegister ? 'Register' : 'Sign In')}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        {isRegister ? (
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                                    Login here
                                </Link>
                            </p>
                        ) : (
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="text-blue-600 font-bold hover:underline">
                                    Register now
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
