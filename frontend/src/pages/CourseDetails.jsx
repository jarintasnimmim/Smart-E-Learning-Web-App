import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkEnrollment = async () => {
            try {
                // ১. কোর্সের তথ্য আনা
                const courseRes = await axios.get('/api/courses/${id}')
                setCourse(courseRes.data);

                // ২. এনরোলমেন্ট স্ট্যাটাস চেক করা
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser?._id) {
                    const userRes = await axios.get('/api/auth/my-courses/${storedUser._id}');
                    const userCourses = userRes.data || [];
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
    }, [id]);

    // পেমেন্ট হ্যান্ডেল করার মেইন ফাংশন
    const handlePayment = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        // ১. লগইন করা না থাকলে লগইন পেজে পাঠাবে
        if (!storedUser) return navigate('/login');

        // ২. যদি আগে থেকেই কেনা থাকে, তবে সরাসরি ভিডিও পেজে নিয়ে যাবে
        if (isEnrolled) return navigate(`/watch/${id}`);

        try {
            // ৩. ব্যাকএন্ড পেমেন্ট এপিআই-তে ডাটা পাঠানো
            const paymentData = {
                courseId: course._id,
                userId: storedUser._id,
                amount: course.price,
                userName: storedUser.name,
                userEmail: storedUser.email
            };

            const response = await axios.post('/api/payment/init', paymentData);

            // ৪. পেমেন্ট গেটওয়ে ইউআরএল-এ রিডাইরেক্ট করা
            if (response.data.url) {
                window.location.replace(response.data.url);
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("পেমেন্ট গেটওয়ে লোড করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।");
        }
    };

    if (loading) return <div className="text-center mt-20 font-bold">Checking Enrollment Status...</div>;
    if (!course) return <div className="text-center mt-20">Course not found</div>;

    return (
        <div className="container mx-auto p-6 mt-10">
            <div className="flex flex-col md:flex-row gap-10 bg-white p-8 shadow-2xl rounded-2xl border">
                <div className="md:w-1/2">
                    <img src={course.image} className="w-full h-80 object-cover rounded-xl shadow-lg" alt="course" />
                </div>
                <div className="md:w-1/2 space-y-6">
                    <h1 className="text-4xl font-extrabold text-gray-800">{course.title}</h1>
                    <p className="text-xl text-blue-600 font-semibold italic">By {course.instructor}</p>
                    
                    <div className="text-3xl font-bold text-green-600">
                        {isEnrolled ? "Owned ✅" : `$${course.price}`}
                    </div>

                    {/* পেমেন্ট বাটনে কানেক্ট করা হয়েছে */}
                    <button 
                        onClick={handlePayment}
                        className={`w-full text-white text-xl py-4 rounded-xl font-bold transition shadow-lg ${
                            isEnrolled ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isEnrolled ? "Start Learning Now" : `Enroll Now for $${course.price}`}
                    </button>

                    {isEnrolled && (
                        <p className="text-center text-green-600 font-medium">You have lifetime access to this course.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;