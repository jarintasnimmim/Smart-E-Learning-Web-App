import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/forgot-password', { email, newPassword });
            alert("Password Changed! Please Login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.msg || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Reset Password</h2>
                <form onSubmit={handleReset} className="space-y-4">
                    <input 
                        type="email" placeholder="Enter Your Registered Email"
                        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        value={email} onChange={(e) => setEmail(e.target.value)} required
                    />
                    <input 
                        type="password" placeholder="Enter New Password"
                        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                    />
                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;