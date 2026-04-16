import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Home from './pages/Home'; 
import Login from './pages/Login';
import SignUp from './pages/SignUp'; 
import Admin from "./components/Admin";
import Footer from './components/Footer';
import CourseDetails from './pages/CourseDetails';
import WatchCourse from './pages/WatchCourse';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import AdminReviews from './pages/AdminReviews';

// পেজ পরিবর্তন হলে অটোমেটিক স্ক্রল উপরে নিয়ে যাওয়ার জন্য এই ছোট কম্পোনেন্ট
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* স্ক্রল টপ এখানে যোগ করা হলো */}
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        
        {/* মেইন কন্টেন্ট এরিয়া */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected বা স্পেশাল রুটস */}
            <Route path="/watch/:id" element={<WatchCourse />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-reviews" element={<AdminReviews />} />
            
            {/* যদি ইউজার ভুল লিঙ্কে যায় তার জন্য (Optional) */}
            <Route path="*" element={<div className="text-center mt-20 font-bold text-2xl">404 - Page Not Found!</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;