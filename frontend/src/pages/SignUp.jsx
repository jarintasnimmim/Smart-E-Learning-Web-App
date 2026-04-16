import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserCheck, GraduationCap, ShieldCheck } from 'lucide-react';
import axios from 'axios'; // Axios import korun

const SignUp = () => {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
  name,
  email,
  password,
  role
   });
      alert("✅ Registration Successful! Please Login.");
      navigate('/login'); // Success hole login page-e niye jabe
    } catch (err) {
      alert("❌ " + (err.response?.data?.msg || "Registration Failed"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-white">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-gray-500 mt-2 font-medium">Join our community of learners today!</p>
        </div>
        
        {/* Form-e onSubmit logic add kora hoyeche */}
        <form className="space-y-4" onSubmit={handleSignUp}>
          
          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { id: 'student', label: 'Student', icon: <GraduationCap size={20}/> },
              { id: 'teacher', label: 'Teacher', icon: <UserCheck size={20}/> },
              { id: 'admin', label: 'Admin', icon: <ShieldCheck size={20}/> },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setRole(item.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  role === item.id 
                  ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md' 
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-blue-200'
                }`}
              >
                {item.icon}
                <span className="text-xs font-bold mt-1">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              className="pl-11 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input 
              type="email" 
              className="pl-11 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input 
              type="password" 
              className="pl-11 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Sign Up Button */}
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 mt-4">
            Get Started
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600 font-medium">
          Already have an account? 
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold ml-1 transition">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;