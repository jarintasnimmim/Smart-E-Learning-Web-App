import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard'; 
import { Search, Sparkles } from 'lucide-react';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const API_URL = import.meta.env.VITE_API_URL || 'https://smart-e-learning-web-app.vercel.app/_/backend';

    useEffect(() => {
        const fetchCourses = async () => {
            try {
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

    const filteredCourses = courses.filter((course) => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ["All", ...new Set(courses.map(course => course.category).filter(Boolean))];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center font-bold text-blue-600 animate-bounce text-xl">
                Loading SmartLearn Courses...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            {/* --- ১. প্রিমিয়াম হিরো ব্যানার (Hero Banner) --- */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-20 px-6 mb-12">
                <div className="container mx-auto text-center">
                    <div className="flex justify-center mb-4">
                        <span className="bg-blue-500/30 text-blue-100 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-400/30">
                            <Sparkles size={16} /> Your Future Starts Here
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Unlock Your Potential with <br /> <span className="text-blue-400">SmartLearn</span> Expert Courses
                    </h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
                        Access high-quality learning materials anytime, anywhere. Start mastering new skills with our industry-leading mentors.
                    </p>
                    
                    {/* সার্চ বার ব্যানারের নিচে */}
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-3xl mx-auto">
                        <div className="relative w-full md:w-2/3 text-gray-800">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search what you want to learn today..."
                                className="p-4 pl-12 border-none rounded-2xl w-full shadow-2xl focus:ring-4 focus:ring-blue-500/50 outline-none text-lg"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select 
                            className="p-4 bg-white text-gray-800 border-none rounded-2xl w-full md:w-1/3 shadow-2xl outline-none text-lg cursor-pointer"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* --- ২. কোর্স লিস্ট সেকশন --- */}
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold mb-10 text-gray-800 flex items-center gap-3">
                    <span className="w-2 h-10 bg-blue-600 rounded-full"></span>
                    {searchTerm ? `Search Results for "${searchTerm}"` : "Trending Courses"}
                </h2>
                
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {filteredCourses.map((course) => (
                            <CourseCard key={course._id} course={course} isDashboard={false} />
                        ))}
                    </div>
                ) : (
                    /* --- ৩. এম্পটি স্টেট (যদি কোনো কোর্স না থাকে) --- */
                    <div className="text-center py-24 bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-100 max-w-4xl mx-auto">
                        <div className="flex justify-center mb-6">
                            <div className="p-6 bg-blue-50 rounded-full text-blue-400">
                                <Search size={60} strokeWidth={1} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Courses Found!</h3>
                        <p className="text-gray-500 text-lg mb-8 max-w-sm mx-auto">
                            We are currently updating our library. New exciting courses are coming very soon!
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                        >
                            Refresh Page
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;