import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ 
        title: '', 
        instructor: '', 
        price: '', 
        image: '', 
        videoUrl: '', 
        description: '' 
    });
    const [editId, setEditId] = useState(null);

    // Vercel বা Local হোস্টের জন্য API Base URL
    const API_URL = import.meta.env.VITE_API_URL || 'https://smart-e-learning-web-app.vercel.app/_/backend';

    const userData = JSON.parse(localStorage.getItem('user'));

    // অ্যাডমিন ভেরিফিকেশন (এটি রেন্ডারিং এর আগে হওয়া উচিত নয়, তাই useEffect এর ভেতরে বা কন্ডিশনাল রেন্ডারিং এ রাখা ভালো)
    if (!userData || userData.role !== 'admin') {
        return <div className="text-center mt-20 text-2xl text-red-600 font-bold">Access Denied! 🚫</div>;
    }

    const fetchCourses = async () => {
        try {
            // ডাইনামিক API URL ব্যবহার করা হয়েছে
            const res = await axios.get(`${API_URL}/api/courses`);
            setCourses(res.data);
        } catch (err) {
            console.error("Fetch failed:", err);
        }
    };

    useEffect(() => { 
        fetchCourses(); 
    }, [API_URL]);

    const handleEdit = (course) => {
        setEditId(course._id);
        setFormData({
            title: course.title,
            instructor: course.instructor,
            price: course.price,
            image: course.image,
            videoUrl: course.videoUrl || '',
            description: course.description || '' 
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const finalData = {
                ...formData,
                price: Number(formData.price),
                videoUrl: formData.videoUrl.replace("watch?v=", "embed/")
            };

            if (editId) {
                // এডিট করার জন্য সঠিক রাউট এবং ব্যাকটিক ব্যবহার
                await axios.put(`${API_URL}/api/courses/${editId}`, finalData);
                alert('✅ Course Updated!');
                setEditId(null);
            } else {
                // নতুন কোর্স অ্যাড করার সঠিক রাউট
                await axios.post(`${API_URL}/api/courses/add`, finalData);
                alert('✅ Course Added!');
            }
            
            setFormData({ title: '', instructor: '', price: '', image: '', videoUrl: '', description: '' });
            fetchCourses();
        } catch (err) { 
            console.error("Error Detail:", err.response?.data);
            alert('❌ Operation failed: ' + (err.response?.data?.msg || "Check Backend")); 
        }
    };

    const deleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                // ডিলিট করার জন্য ব্যাকটিক এবং ডাইনামিক URL
                await axios.delete(`${API_URL}/api/courses/${id}`);
                alert("🗑️ Course Deleted!");
                fetchCourses();
            } catch (err) {
                alert("❌ Delete failed");
            }
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 bg-slate-900 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-10 text-white">Admin Dashboard</h2>
            
            <div className="max-w-md mx-auto bg-white p-6 shadow-2xl rounded-3xl mb-12 border-t-8 border-blue-600">
                <h3 className="text-xl font-bold mb-6 text-gray-800 text-center uppercase tracking-wide">
                    {editId ? "📝 Edit Course" : "➕ Add New Course"}
                </h3>
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <input type="text" placeholder="Instructor" value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <input type="text" placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                    
                    <textarea 
                        placeholder="Course Description" 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        className="w-full p-3 border rounded-xl h-24 focus:ring-2 focus:ring-blue-500 outline-none" 
                        required 
                    />

                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <label className="text-xs font-bold text-blue-600 uppercase ml-1">YouTube Link</label>
                        <input 
                            type="text" 
                            placeholder="Paste link here" 
                            value={formData.videoUrl} 
                            onChange={e => setFormData({...formData, videoUrl: e.target.value})} 
                            className="w-full p-2 border rounded-lg mt-1 text-sm focus:ring-2 focus:ring-blue-400 outline-none" 
                            required 
                        />
                    </div>
                    
                    <button className={`w-full text-white p-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${editId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}>
                        {editId ? "Update Course Details" : "Publish Course"}
                    </button>

                    {editId && (
                        <button type="button" onClick={() => {setEditId(null); setFormData({title:'', instructor:'', price:'', image:'', videoUrl:'', description:''})}} className="w-full bg-gray-400 text-white p-2 rounded-xl mt-2 font-semibold">
                            Cancel Edit
                        </button>
                    )}
                </form>
            </div>

            <div className="max-w-5xl mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                    Inventory / Manage Courses
                </h3>
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-sm">
                            <tr>
                                <th className="p-4 border-b">Course Title</th>
                                <th className="p-4 border-b">Instructor</th>
                                <th className="p-4 border-b">Price</th>
                                <th className="p-4 border-b text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {courses.map(course => (
                                <tr key={course._id} className="hover:bg-blue-50/50 transition-colors border-b last:border-0">
                                    <td className="p-4 font-medium">{course.title}</td>
                                    <td className="p-4">{course.instructor}</td>
                                    <td className="p-4 text-green-600 font-bold">${course.price}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleEdit(course)} className="bg-yellow-400 text-slate-800 px-4 py-1.5 rounded-lg font-bold hover:bg-yellow-500 transition-all text-sm">Edit</button>
                                            <button onClick={() => deleteCourse(course._id)} className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-bold hover:bg-red-600 transition-all text-sm">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;