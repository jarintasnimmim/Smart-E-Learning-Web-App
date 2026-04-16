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
    if(window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black tracking-tight text-blue-600 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg">S</div>
              <span>SmartLearn</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-bold transition">Home</Link>
            <Link to="/courses" className="text-gray-600 hover:text-blue-600 font-bold transition">Courses</Link>
            
            {userData ? (
              <div className="flex items-center space-x-4 border-l pl-6 ml-2">
                
                {/* User Info & Profile */}
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white font-bold border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                    {userData.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs text-gray-400 font-bold leading-none uppercase">Profile</p>
                    <p className="text-sm text-gray-700 font-bold">{userData.name?.split(' ')[0]}</p>
                  </div>
                </Link>

                {/* Conditional Buttons based on Role */}
                {userData.role === 'admin' ? (
                  <div className="flex items-center gap-2">
                    <Link to="/admin" className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all text-sm border border-red-100">
                      Admin Panel ⚙️
                    </Link>
                    <Link to="/admin-reviews" className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-slate-800 hover:text-white transition-all text-sm border border-slate-200">
                      Reviews ⭐
                    </Link>
                  </div>
                ) : (
                  <Link to="/dashboard" className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                    Dashboard
                  </Link>
                )}

                <button 
                  onClick={handleLogout} 
                  className="text-gray-400 hover:text-red-500 font-bold text-sm transition px-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-3 flex items-center border-l pl-6">
                <Link to="/login" className="text-gray-600 font-bold hover:text-blue-600">Login</Link>
                <Link to="/signup" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 p-2 focus:outline-none">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-3 font-bold text-gray-700">
            <Link to="/" className="p-3 hover:bg-gray-50 rounded-xl" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/courses" className="p-3 hover:bg-gray-50 rounded-xl" onClick={() => setIsOpen(false)}>All Courses</Link>
            
            {userData ? (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link to="/profile" className="p-3 bg-blue-50 text-blue-600 rounded-xl flex items-center gap-3" onClick={() => setIsOpen(false)}>
                   Profile (Account Settings)
                </Link>
                {userData.role === 'admin' ? (
                  <>
                    <Link to="/admin" className="p-3 text-red-600 bg-red-50 rounded-xl" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
                    <Link to="/admin-reviews" className="p-3 text-slate-600 bg-slate-50 rounded-xl" onClick={() => setIsOpen(false)}>Student Reviews</Link>
                  </>
                ) : (
                  <Link to="/dashboard" className="p-3 text-blue-600 bg-blue-50 rounded-xl" onClick={() => setIsOpen(false)}>My Learning Dashboard</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left p-3 text-red-500 font-black">Logout</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                <Link to="/login" className="text-center p-3 text-gray-600" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/signup" className="text-center p-3 bg-blue-600 text-white rounded-xl" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;