import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard'; 

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Vercel বা Local হোস্টের জন্য API Base URL সেট করা
    const API_URL = import.meta.env.VITE_API_URL || 'https://smart-e-learning-web-app.vercel.app/_/backend';

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // এখানে পূর্ণাঙ্গ এপিআই লিঙ্ক এবং ব্যাকটিক (`) ব্যবহার করা হয়েছে
                const res = await axios.get(`${API_URL}/api/courses`);
                setCourses(res.data);
            } catch (err) {
                console.error("Home page data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [API_URL]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center font-bold text-blue-600 animate-bounce text-xl">
                Loading SmartLearn Courses...
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h2 className="text-3xl font-extrabold text-center mb-10 text-gray-800">
                Explore Our <span className="text-blue-600">Top Courses</span>
            </h2>
            
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <CourseCard key={course._id} course={course} isDashboard={false} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 text-xl font-medium">No courses available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default Home;