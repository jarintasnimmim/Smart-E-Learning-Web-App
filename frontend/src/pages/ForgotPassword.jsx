import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    // Vercel বা Local হোস্টের জন্য API Base URL
    const API_URL = import.meta.env.VITE_API_URL || 'https://smart-e-learning-web-app.vercel.app/_/backend';

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            // পূর্ণাঙ্গ এপিআই লিঙ্ক এবং ব্যাকটিক (`) ব্যবহার করা হয়েছে
            await axios.post(`${API_URL}/api/auth/forgot-password`, { email, newPassword });
            
            alert("✅ Password Changed! Please Login.");
            navigate('/login');
        } catch (err) {
            alert("❌ " + (err.response?.data?.msg || "Something went wrong"));
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Reset Password</h2>
                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Registered Email</label>
                        <input 
                            type="email" 
                            placeholder="haider@gmail.com"
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">New Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter New Password"
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required
                        />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-3 mt-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;