import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard'; 

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // এখানে পরিবর্তন করা হয়েছে: localhost বাদ দিয়ে শুধু /api ব্যবহার করুন
                const res = await axios.get('/api/courses');
                setCourses(res.data);
            } catch (err) {
                console.error("Home page data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) return <div className="text-center mt-20 font-bold text-blue-600">Loading SmartLearn Courses...</div>;

    return (
        <div className="container mx-auto p-6">
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
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
                    <p className="text-gray-500 text-xl font-medium">No courses available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default Home;