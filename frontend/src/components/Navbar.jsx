import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const getUserData = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  };

  const userData = getUserData();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
              SmartLearn
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/courses" className="text-gray-700 hover:text-blue-600 font-medium">Courses</Link>
            
            {userData && (
              <>
                {/* প্রোফাইল লিঙ্ক */}
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium border-l pl-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                    {userData.name?.charAt(0).toUpperCase()}
                  </div>
                  My Profile
                </Link>

                {userData.role !== 'admin' && (
                  <Link to="/dashboard" className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-all">
                    My Dashboard 
                  </Link>
                )}

                {/* অ্যাডমিন সেকশন */}
                {userData.role === 'admin' && (
                  <div className="flex items-center space-x-4 border-l pl-4">
                    <Link to="/admin" className="text-red-600 font-bold hover:text-red-700">
                      Admin Panel ⚙️
                    </Link>
                    <Link to="/admin-reviews" className="text-blue-600 font-bold hover:text-blue-800 border border-blue-600 px-3 py-1 rounded-lg text-sm">
                      Manage Reviews ⭐
                    </Link>
                  </div>
                )}

                <button onClick={handleLogout} className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition">
                  Logout
                </button>
              </>
            )}

            {!userData && (
              <div className="space-x-4 flex items-center">
                <Link to="/login" className="text-blue-600 font-semibold">Login</Link>
                <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 p-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Optional: Mobile এর জন্য লিঙ্কগুলো যোগ করা) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col space-y-4">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/courses" onClick={() => setIsOpen(false)}>Courses</Link>
          {userData?.role === 'admin' && (
            <>
              <Link to="/admin" className="text-red-600 font-bold" onClick={() => setIsOpen(false)}>Admin Panel</Link>
              <Link to="/admin-reviews" className="text-blue-600 font-bold" onClick={() => setIsOpen(false)}>Manage Reviews</Link>
            </>
          )}
          {userData && <button onClick={handleLogout} className="text-red-500 text-left">Logout</button>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;