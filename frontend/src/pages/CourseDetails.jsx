import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);

    // Vercel বা Local হোস্টের জন্য API Base URL
    const API_URL = import.meta.env.VITE_API_URL || 'https://smart-e-learning-web-app.vercel.app/_/backend';

    useEffect(() => {
        const checkEnrollment = async () => {
            try {
                // ১. কোর্সের তথ্য আনা (ব্যাকটিক ব্যবহার করা হয়েছে)
                const courseRes = await axios.get(`${API_URL}/api/courses/${id}`);
                setCourse(courseRes.data);

                // ২. এনরোলমেন্ট স্ট্যাটাস চেক করা
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const userId = storedUser?._id || storedUser?.id;

                if (userId) {
                    const userRes = await axios.get(`${API_URL}/api/auth/my-courses/${userId}`);
                    const userCourses = userRes.data || [];
                    
                    // চেক করা ইউজার এই কোর্সে এনরোল্ড কি না
                    const match = userCourses.some(c => 
                        String(c._id || c).trim() === String(id).trim()
                    );
                    setIsEnrolled(match);
                }
            } catch (err) {
                console.error("Status check failed:", err.message);
            } finally {
                setLoading(false);
            }
        };
        checkEnrollment();
    }, [id, API_URL]);

    // পেমেন্ট হ্যান্ডেল করার মেইন ফাংশন
    const handlePayment = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser?._id || storedUser?.id;
        
        // ১. লগইন করা না থাকলে লগইন পেজে পাঠাবে
        if (!storedUser) return navigate('/login');

        // ২. যদি আগে থেকেই কেনা থাকে, তবে সরাসরি ভিডিও পেজে নিয়ে যাবে
        if (isEnrolled) return navigate(`/watch/${id}`);

        try {
            // ৩. ব্যাকএন্ড পেমেন্ট এপিআই-তে ডাটা পাঠানো
            const paymentData = {
                courseId: course._id,
                userId: userId,
                amount: course.price,
                userName: storedUser.name,
                userEmail: storedUser.email
            };

            const response = await axios.post(`${API_URL}/api/payment/init`, paymentData);

            // ৪. পেমেন্ট গেটওয়ে ইউআরএল-এ রিডাইরেক্ট করা (SSLCommerz/অন্যান্য)
            if (response.data.url) {
                window.location.replace(response.data.url);
            } else {
                alert("পেমেন্ট ইউআরএল পাওয়া যায়নি।");
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("❌ পেমেন্ট গেটওয়ে লোড করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl font-bold animate-pulse text-blue-600">Checking Enrollment Status...</div>
        </div>
    );
    
    if (!course) return (
        <div className="text-center mt-20 text-red-500 font-bold">Course not found!</div>
    );

    return (
        <div className="container mx-auto p-4 md:p-10 mt-10">
            <div className="flex flex-col md:flex-row gap-10 bg-white p-6 md:p-10 shadow-2xl rounded-3xl border border-gray-100">
                <div className="md:w-1/2">
                    <img 
                        src={course.image} 
                        className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg border" 
                        alt={course.title} 
                    />
                </div>
                <div className="md:w-1/2 space-y-6">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                        {course.title}
                    </h1>
                    <p className="text-xl text-blue-600 font-semibold italic">By {course.instructor}</p>
                    
                    <div className="text-3xl font-bold text-slate-800">
                        {isEnrolled ? (
                            <span className="text-green-600 flex items-center gap-2">Owned ✅</span>
                        ) : (
                            <span className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">${course.price}</span>
                        )}
                    </div>

                    <p className="text-gray-600 text-lg leading-relaxed">
                        {course.description || "Master this course with hands-on projects and expert guidance."}
                    </p>

                    <button 
                        onClick={handlePayment}
                        className={`w-full text-white text-xl py-5 rounded-2xl font-bold transition-all transform active:scale-95 shadow-xl ${
                            isEnrolled ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                        }`}
                    >
                        {isEnrolled ? "Start Learning Now" : `Enroll Now for $${course.price}`}
                    </button>

                    {isEnrolled && (
                        <p className="text-center text-green-600 font-bold animate-bounce">
                            🎉 You have lifetime access to this course.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;