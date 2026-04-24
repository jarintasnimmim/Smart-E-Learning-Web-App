import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Star, CheckCircle } from 'lucide-react'; 

const WatchCourse = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [userRating, setUserRating] = useState(5);
    const [comment, setComment] = useState('');
    // প্রগ্রেস ট্র্যাকিংয়ের জন্য নতুন স্টেট
    const [isCompleted, setIsCompleted] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const API_URL = import.meta.env.VITE_API_URL || 'https://smart-e-learning-web-app.vercel.app/_/backend';

    const fetchCourse = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/courses/${id}`);
            setCourse(res.data);
            
            // লোকাল স্টোরেজ থেকে চেক করা এই কোর্সটি আগে শেষ হয়েছে কি না
            const completed = localStorage.getItem(`completed_${id}`);
            if (completed) setIsCompleted(true);
        } catch (err) {
            console.error("Course load failed", err);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [id]);

    // কোর্স কমপ্লিট করার ফাংশন
    const handleMarkAsCompleted = () => {
        setIsCompleted(true);
        localStorage.setItem(`completed_${id}`, 'true');
        alert("Congratulations! You have successfully completed this course.");
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!storedUser) {
            alert("Please login to post a review!");
            return;
        }
        try {
            const res = await axios.post(`${API_URL}/api/courses/${id}/review`, {
                rating: userRating,
                comment: comment,
                userId: storedUser.id || storedUser._id,
                userName: storedUser.name
            });
            alert(res.data.message || "Review Added!");
            setComment('');
            fetchCourse();
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Something went wrong";
            alert("❌ " + errorMsg);
        }
    };

    if (!course) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-white text-2xl animate-pulse italic tracking-widest">Loading Video...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* ভিডিও প্লেয়ার সেকশন */}
                <div className="relative pt-[56.25%] bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                    <iframe 
                        className="absolute inset-0 w-full h-full"
                        src={course.videoUrl} 
                        title="Course Video"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* --- নতুন প্রগ্রেস বাটন সেকশন --- */}
                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={handleMarkAsCompleted}
                        disabled={isCompleted}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 transform active:scale-95 ${
                            isCompleted 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-default' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/40'
                        }`}
                    >
                        {isCompleted ? (
                            <><CheckCircle size={20} /> Course Completed</>
                        ) : (
                            "Mark as Completed"
                        )}
                    </button>
                </div>

                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                {course.title}
                            </h1>
                            <p className="text-slate-400 mt-4 text-lg leading-relaxed">{course.description}</p>
                        </div>

                        {/* রিভিউ ফর্ম */}
                        <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm shadow-xl">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Star className="text-yellow-500 fill-yellow-500" /> Share Your Thoughts
                            </h3>
                            <form onSubmit={submitReview} className="space-y-6">
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setUserRating(num)}
                                            className={`transition-all duration-300 transform hover:scale-125 ${userRating >= num ? 'text-yellow-400' : 'text-slate-700'}`}
                                        >
                                            <Star fill={userRating >= num ? "currentColor" : "none"} size={32} />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    className="w-full bg-slate-800/50 border border-slate-700 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-slate-500"
                                    placeholder="I really loved the way the instructor explained..."
                                    rows="4"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/40 active:scale-95">
                                    Post My Review
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* রিভিউ লিস্ট */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <h3 className="text-2xl font-bold">Student Feedbacks</h3>
                            <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold border border-blue-600/30">
                                {course.reviews?.length || 0}
                            </span>
                        </div>
                        
                        <div className="max-h-[600px] overflow-y-auto pr-3 space-y-4 custom-scrollbar">
                            {course.reviews?.length > 0 ? (
                                [...course.reviews].reverse().map((rev, index) => (
                                    <div key={index} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-all shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-bold text-blue-400">{rev.userName}</span>
                                            <div className="flex text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-slate-800"} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-300 text-sm italic leading-relaxed">"{rev.comment}"</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-slate-500 italic">No reviews yet. Be the first to share your experience!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchCourse;