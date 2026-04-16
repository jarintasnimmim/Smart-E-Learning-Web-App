import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'; // Link ইমপোর্ট করা হয়েছে
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import Swal from 'sweetalert2';

const Dashboard = () => {
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    const storedUser = localStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : null;

    // Vercel বা Local হোস্টের জন্য API Base URL
    const API_URL = import.meta.env.VITE_API_URL || 'https://smart-e-learning-web-app.vercel.app/_/backend';

    useEffect(() => {
        // ১. পেমেন্ট সাকসেস মেসেজ চেক করা
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('payment') === 'success') {
            Swal.fire({
                title: 'পেমেন্ট সফল হয়েছে!',
                text: 'অভিনন্দন! আপনি সফলভাবে নতুন কোর্সে এনরোল করেছেন।',
                icon: 'success',
                confirmButtonColor: '#2563eb',
                confirmButtonText: 'ধন্যবাদ'
            });
        }

        const fetchMyCourses = async () => {
            const userId = userData?._id || userData?.id;
            if (!userId) return;
            
            try {
                // পূর্ণাঙ্গ এপিআই লিঙ্ক এবং ব্যাকটিক (`) ব্যবহার করা হয়েছে
                const res = await axios.get(`${API_URL}/api/auth/my-courses/${userId}`);
                setMyCourses(res.data);
            } catch (err) {
                console.error("Error loading courses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, [location.search, userData?._id, API_URL]); // dependency array আপডেট করা হয়েছে

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-slate-800">Please Login First!</h2>
                    <Link to="/login" className="mt-4 inline-block text-blue-600 font-bold hover:underline">Go to Login</Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center text-slate-800 text-xl font-bold italic animate-pulse">
                    Loading your courses...
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 min-h-screen bg-gray-50"> 
            <div className="mb-10 border-b border-gray-200 pb-4">
                <h1 className="text-4xl font-extrabold text-slate-900 drop-shadow-sm">
                    Welcome back, <span className="text-blue-600">{userData?.name}</span>! 👋
                </h1>
                <p className="text-lg text-slate-500 mt-2 italic">
                    Continue your learning journey where you left off.
                </p>
            </div>

            <h2 className="text-2xl font-bold mb-8 text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                My Learning Dashboard
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {myCourses.length > 0 ? (
                    myCourses.map(course => (
                        <CourseCard key={course._id} course={course} isDashboard={true} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 text-xl font-medium">You haven't enrolled in any courses yet.</p>
                        <Link to="/" className="text-blue-600 font-bold hover:underline mt-4 inline-block text-lg">
                            Explore Courses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;