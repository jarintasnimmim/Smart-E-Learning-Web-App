import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, MessageSquare } from 'lucide-react';

const AdminReviews = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCoursesWithReviews();
    }, []);

    const fetchCoursesWithReviews = async () => {
        const res = await axios.get('http://localhost:5000/api/courses');
        setCourses(res.data);
    };

    const deleteReview = async (courseId, reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await axios.delete(`http://localhost:5000/api/courses/${courseId}/review/${reviewId}`);
                alert("Review Deleted!");
                fetchCoursesWithReviews(); // লিস্ট আপডেট
            } catch (err) {
                alert("Failed to delete review");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <MessageSquare className="text-blue-500" /> Manage Student Reviews
            </h2>

            <div className="space-y-8">
                {courses.map(course => (
                    course.reviews?.length > 0 && (
                        <div key={course._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-blue-400 mb-4">{course.title}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.reviews.map(rev => (
                                    <div key={rev._id} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-center border border-slate-700">
                                        <div>
                                            <p className="font-bold text-sm">{rev.userName} <span className="text-yellow-500 ml-2">⭐ {rev.rating}</span></p>
                                            <p className="text-slate-400 text-xs mt-1">{rev.comment}</p>
                                        </div>
                                        <button 
                                            onClick={() => deleteReview(course._id, rev._id)}
                                            className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default AdminReviews;