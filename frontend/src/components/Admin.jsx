import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const [courses, setCourses] = useState([]);
    // ১. description স্টেট যোগ করা হয়েছে ব্যাকএন্ডের সাথে মিল রাখতে
    const [formData, setFormData] = useState({ 
        title: '', 
        instructor: '', 
        price: '', 
        image: '', 
        videoUrl: '', 
        description: '' 
    });
    const [editId, setEditId] = useState(null);

    const userData = JSON.parse(localStorage.getItem('user'));

    // অ্যাডমিন ভেরিফিকেশন
    if (!userData || userData.role !== 'admin') {
        return <div className="text-center mt-20 text-2xl text-red-600 font-bold">Access Denied! 🚫</div>;
    }

    const fetchCourses = async () => {
        try {
            const res = await axios.get('/api/courses');
            setCourses(res.data);
        } catch (err) {
            console.error("Fetch failed");
        }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleEdit = (course) => {
        setEditId(course._id);
        setFormData({
            title: course.title,
            instructor: course.instructor,
            price: course.price,
            image: course.image,
            videoUrl: course.videoUrl || '',
            description: course.description || '' // এডিট করার সময় ডেসক্রিপশন আনা
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // ইউটিউব লিঙ্ক অটো-ফিক্স লজিক
            const finalData = {
                ...formData,
                price: Number(formData.price),
                videoUrl: formData.videoUrl.replace("watch?v=", "embed/")
            };

            if (editId) {
                // ২. এডিট করার জন্য সঠিক রাউট (PUT)
                await axios.put('/api/courses/${editId}', finalData);
                alert('Course Updated!');
                setEditId(null);
            } else {
                // ৩. নতুন কোর্স অ্যাড করার সঠিক রাউট (POST /add)
                // আপনার courseRoutes অনুযায়ী এটি /api/courses/add হবে
                await axios.post('/api/courses/add', finalData);
                alert('Course Added!');
            }
            
            setFormData({ title: '', instructor: '', price: '', image: '', videoUrl: '', description: '' });
            fetchCourses();
        } catch (err) { 
            console.error("Error Detail:", err.response?.data);
            alert('Operation failed: ' + (err.response?.data?.msg || "Check Backend")); 
        }
    };

    const deleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete('/api/courses/${id}');
                fetchCourses();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    return (
        <div className="container mx-auto p-6 bg-slate-900 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-10 text-white">Admin Dashboard</h2>
            
            <div className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg mb-12 border-t-4 border-blue-600">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
                    {editId ? "📝 Edit Course" : "➕ Add New Course"}
                </h3>
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" required />
                    <input type="text" placeholder="Instructor" value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full p-2 border rounded" required />
                    <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded" required />
                    <input type="text" placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-2 border rounded" required />
                    
                    <textarea 
                        placeholder="Course Description" 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        className="w-full p-2 border rounded h-24" 
                        required 
                    />

                    <div className="bg-blue-50 p-2 rounded border border-blue-200">
                        <label className="text-xs font-bold text-blue-600 uppercase">YouTube Link</label>
                        <input 
                            type="text" 
                            placeholder="Paste link here" 
                            value={formData.videoUrl} 
                            onChange={e => setFormData({...formData, videoUrl: e.target.value})} 
                            className="w-full p-2 border rounded mt-1 text-sm" 
                            required 
                        />
                    </div>
                    
                    <button className={`w-full text-white p-3 rounded-lg font-bold transition-all shadow-md ${editId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {editId ? "Update Course Details" : "Publish Course"}
                    </button>

                    {editId && (
                        <button type="button" onClick={() => {setEditId(null); setFormData({title:'', instructor:'', price:'', image:'', videoUrl:'', description:''})}} className="w-full bg-gray-400 text-white p-2 rounded mt-2">
                            Cancel Edit
                        </button>
                    )}
                </form>
            </div>

            <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-white">Inventory / Manage Courses</h3>
                <div className="bg-white shadow-md rounded-lg overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 border">Course Title</th>
                                <th className="p-4 border">Instructor</th>
                                <th className="p-4 border">Price</th>
                                <th className="p-4 border text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 border font-medium">{course.title}</td>
                                    <td className="p-4 border">{course.instructor}</td>
                                    <td className="p-4 border text-green-600 font-bold">${course.price}</td>
                                    <td className="p-4 border text-center flex justify-center gap-2">
                                        <button onClick={() => handleEdit(course)} className="bg-yellow-400 text-slate-800 px-3 py-1 rounded-md font-semibold hover:bg-yellow-500 transition-all">Edit</button>
                                        <button onClick={() => deleteCourse(course._id)} className="bg-red-500 text-white px-3 py-1 rounded-md font-semibold hover:bg-red-600 transition-all">Delete</button>
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