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
import About from './pages/About';
import Contact from './pages/Contact';

// পেজ পরিবর্তন হলে অটোমেটিক স্ক্রল উপরে নিয়ে যাওয়ার জন্য
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
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* ১. এই লাইনটি যোগ করা হলো যাতে 'Courses' বাটনে ক্লিক করলে 404 না আসে */}
            <Route path="/courses" element={<Home />} /> 
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* কোর্স ডিটেইলস পেজ */}
            <Route path="/course/:id" element={<CourseDetails />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/watch/:id" element={<WatchCourse />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-reviews" element={<AdminReviews />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* ২. ভুল পাথের জন্য 404 হ্যান্ডলার */}
            <Route path="*" element={<div className="text-center mt-20 font-bold text-2xl">404 - Page Not Found!</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;