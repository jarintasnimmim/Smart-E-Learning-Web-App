import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import Swal from 'sweetalert2';

const Dashboard = () => {
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    const storedUser = localStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        // ১. পেমেন্ট সাকসেস মেসেজ চেক করা
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('payment') === 'success') {
            Swal.fire({
                title: 'পেমেন্ট সফল হয়েছে!',
                text: 'অভিনন্দন! আপনি সফলভাবে নতুন কোর্সে এনরোল করেছেন।',
                icon: 'success',
                confirmButtonColor: '#2563eb',
                confirmButtonText: 'ধন্যবাদ'
            });
            // ক্লিন ইউআরএল (ঐচ্ছিক): আপনি চাইলে পেমেন্ট সাকসেস প্যারামিটার সরিয়ে দিতে পারেন
        }

        const fetchMyCourses = async () => {
            if (!userData?._id) return;
            try {
                const res = await axios.get('/api/auth/my-courses/${userData._id}');
                setMyCourses(res.data);
            } catch (err) {
                console.error("Error loading courses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, [location, userData?._id]);

    if (!userData) {
        return <div className="text-center mt-20 text-slate-800 text-xl font-bold">Please Login First!</div>;
    }

    if (loading) {
        return <div className="text-center mt-20 text-slate-800 text-xl font-bold italic">Loading your courses...</div>;
    }

    return (
        <div className="container mx-auto p-8 min-h-screen bg-gray-50"> 
            <div className="mb-10 border-b pb-4">
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
                    <div className="col-span-3 text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 text-xl">You haven't enrolled in any courses yet.</p>
                        <Link to="/courses" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Explore Courses</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;