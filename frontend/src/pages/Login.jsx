import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Vercel বা Local হোস্টের জন্য API Base URL সেট করা
    const API_URL = import.meta.env.VITE_API_URL || 'https://smart-e-learning-web-app.vercel.app/_/backend';

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // পূর্ণাঙ্গ এপিআই লিঙ্ক এবং ব্যাকটিক (`) ব্যবহার করা হয়েছে
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            
            // ১. ব্যাকএন্ড থেকে আসা টোকেনটি ব্রাউজারে সেভ করা
            localStorage.setItem('token', res.data.token); 
            // ২. ইউজারের নাম বা অন্যান্য তথ্যও সেভ করে রাখা
            localStorage.setItem('user', JSON.stringify(res.data.user));

            alert("✅ Login Successful!");
            navigate('/'); 
            window.location.reload(); // ন্যাভিবার আপডেট করার জন্য রিফ্রেশ
        } catch (err) {
            alert("❌ " + (err.response?.data?.msg || "Login failed"));
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="p-8">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
                        <p className="text-gray-500 mt-3 text-lg">Login to access your courses</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                            <div className="mt-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="haider@gmail.com"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white outline-none transition-all duration-200"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-1 ml-1">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <Link to="/forgot-password" size={20} className="text-sm font-bold text-blue-600 hover:text-blue-700">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white outline-none transition-all duration-200"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98] mt-8"
                        >
                            <LogIn size={22} />
                            <span className="text-lg">Sign In</span>
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-600 font-medium">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-bold decoration-2">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;