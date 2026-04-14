import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        
        {/* মেইন কন্টেন্ট এরিয়া */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/watch/:id" element={<WatchCourse />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin-reviews" element={<AdminReviews />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;