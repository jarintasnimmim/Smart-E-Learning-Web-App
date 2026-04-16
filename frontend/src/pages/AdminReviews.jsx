import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, MessageSquare } from 'lucide-react';

const AdminReviews = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Vercel বা Local হোস্টের জন্য API Base URL
    const API_URL = import.meta.env.VITE_API_URL || 'https://smart-e-learning-web-app.vercel.app/_/backend';

    useEffect(() => {
        fetchCoursesWithReviews();
    }, []);

    const fetchCoursesWithReviews = async () => {
        try {
            setLoading(true);
            // লোকালহোস্টের বদলে API_URL ব্যবহার করা হয়েছে
            const res = await axios.get(`${API_URL}/api/courses`);
            setCourses(res.data);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteReview = async (courseId, reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                // ডিলিট রিকোয়েস্টে ডাইনামিক URL এবং ব্যাকটিক (`) ব্যবহার করা হয়েছে
                await axios.delete(`${API_URL}/api/courses/${courseId}/review/${reviewId}`);
                alert("✅ Review Deleted!");
                fetchCoursesWithReviews(); // লিস্ট রিফ্রেশ করা
            } catch (err) {
                console.error("Delete failed:", err);
                alert("❌ Failed to delete review");
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center italic">
            Loading Reviews...
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <MessageSquare className="text-blue-500" /> Manage Student Reviews
            </h2>

            <div className="space-y-8">
                {courses.some(course => course.reviews?.length > 0) ? (
                    courses.map(course => (
                        course.reviews?.length > 0 && (
                            <div key={course._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-800 pb-2">
                                    {course.title}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {course.reviews.map(rev => (
                                        <div key={rev._id} className="bg-slate-800/40 p-4 rounded-xl flex justify-between items-center border border-slate-700 hover:border-blue-500/50 transition-all">
                                            <div>
                                                <p className="font-bold text-sm text-slate-200">
                                                    {rev.userName} 
                                                    <span className="text-yellow-500 ml-2">⭐ {rev.rating}</span>
                                                </p>
                                                <p className="text-slate-400 text-xs mt-1 italic">"{rev.comment}"</p>
                                            </div>
                                            <button 
                                                onClick={() => deleteReview(course._id, rev._id)}
                                                className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all active:scale-90"
                                                title="Delete Review"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
                        <p className="text-slate-500 text-xl font-medium">No reviews found to manage.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviews;