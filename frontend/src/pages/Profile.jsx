import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // এডিট করার জন্য ডাটা স্টেট
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        phone: '',
        avatar: ''
    });

    // Vercel বা Local হোস্টের জন্য API Base URL সেট করা
    const API_URL = import.meta.env.VITE_API_URL || 'https://smart-e-learning-web-app.vercel.app/_/backend';
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // ডাটাবেস থেকে ইউজারের তথ্য নিয়ে আসা
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = storedUser?.id || storedUser?._id; 
                if (!userId) return;

                // এখানে ব্যাকটিক (`) এবং API_URL ব্যবহার করা হয়েছে
                const res = await axios.get(`${API_URL}/api/auth/profile/${userId}`);
                setUser(res.data);
                
                // এডিট ফর্মের ডিফল্ট ভ্যালু সেট করা
                setFormData({
                    name: res.data.name || '',
                    bio: res.data.bio || '',
                    phone: res.data.phone || '',
                    avatar: res.data.avatar || ''
                });
            } catch (err) {
                console.error("Profile load failed:", err.response?.data);
            }
        };
        if (storedUser) fetchUserData();
    }, []);

    // আপডেট করার ফাংশন
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const userId = storedUser.id || storedUser._id;
            // এখানেও ব্যাকটিক (`) এবং API_URL ব্যবহার করা হয়েছে
            const res = await axios.put(`${API_URL}/api/auth/profile/${userId}`, formData);
            
            setUser(res.data); // স্ক্রিনে ডাটা আপডেট
            
            // LocalStorage আপডেট করা যাতে নাম পরিবর্তন ন্যাভিবারেও দেখা যায়
            localStorage.setItem('user', JSON.stringify({ ...storedUser, name: formData.name }));
            
            setIsEditing(false);
            alert("✅ Profile Updated!");
        } catch (err) {
            alert("❌ Update failed!");
        }
    };

    if (!user) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="text-white text-center italic animate-pulse">Loading Profile...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            {/* প্রোফাইল কার্ড */}
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 w-full max-w-md text-center">
                
                {/* প্রোফাইল পিকচার */}
                <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500 object-cover" 
                    alt="profile" 
                />
                
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-blue-400 font-medium mb-1 uppercase text-xs tracking-widest">{user.role}</p>
                
                {/* বায়ো সেকশন */}
                <p className="text-slate-400 text-sm italic mb-6">
                    {user.bio || "No bio added yet. Click edit to add one!"}
                </p>
                
                <div className="text-left space-y-4">
                    {/* ইমেইল */}
                    <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                        <p className="text-xs text-slate-500 font-bold uppercase">Email</p>
                        <p className="text-white text-sm">{user.email}</p>
                    </div>

                    {/* ফোন নম্বর */}
                    <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                        <p className="text-xs text-slate-500 font-bold uppercase">Phone</p>
                        <p className="text-white text-sm">{user.phone || "Not provided"}</p>
                    </div>
                </div>
                
                {/* এডিট বাটন */}
                <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition shadow-lg"
                >
                    Edit Settings
                </button>
            </div>

            {/* এডিট করার পপ-আপ (Modal) */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md border border-slate-700 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Edit Profile Information</h3>
                        
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="text-slate-400 text-xs font-bold uppercase">Full Name</label>
                                <input 
                                    className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white mt-1 outline-none focus:border-blue-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-slate-400 text-xs font-bold uppercase">Short Bio</label>
                                <input 
                                    className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white mt-1 outline-none focus:border-blue-500"
                                    placeholder="e.g. MERN Stack Developer"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="text-slate-400 text-xs font-bold uppercase">Phone Number</label>
                                <input 
                                    className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white mt-1 outline-none focus:border-blue-500"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="text-slate-400 text-xs font-bold uppercase">Avatar Image URL</label>
                                <input 
                                    className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white mt-1 outline-none focus:border-blue-500"
                                    placeholder="https://image-link.com/photo.jpg"
                                    value={formData.avatar}
                                    onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 bg-blue-600 py-2 rounded text-white font-bold hover:bg-blue-700 transition">
                                    Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(false)} 
                                    className="flex-1 bg-slate-700 py-2 rounded text-white hover:bg-slate-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;