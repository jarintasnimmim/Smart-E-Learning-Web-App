import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Globe } from 'lucide-react'; 

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-8 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        {/* Logo and Description */}
        <div className="space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">S</div>
            <h2 className="text-2xl font-bold text-white tracking-tight">SmartLearn</h2>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-sm mx-auto md:mx-0">
            Enhance your skills with the country’s top mentors. Learn anytime, from anywhere with our industry-leading curriculum.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-slate-100 uppercase tracking-widest">Quick Links</h3>
          <ul className="space-y-3">
            <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Home</Link></li>
            <li><Link to="/courses" className="text-slate-400 hover:text-blue-400 transition-colors">All Courses</Link></li>
            <li><Link to="/about" className="text-slate-400 hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-slate-400 hover:text-blue-400 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Us Section */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-slate-100 uppercase tracking-widest">Contact Us</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3 text-slate-400">
              <Mail size={18} className="text-blue-500" />
              <span>support@smartlearn.com</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3 text-slate-400">
              <Phone size={18} className="text-blue-500" />
              <span>+880 1234 567 890</span>
            </div>
            
            {/* Social Icons with Direct SVG (No Blank Issue anymore) */}
            <div className="flex justify-center md:justify-start space-x-3 mt-6">
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-xl hover:bg-blue-600 transition-all text-white flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>

              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-xl hover:bg-blue-700 transition-all text-white flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-xl hover:bg-red-600 transition-all text-white flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
              </a>

              {/* Global/Globe */}
              <a href="#" className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all text-white flex items-center justify-center">
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-slate-500 text-xs border-t border-slate-800/30 pt-8">
        <p>© {new Date().getFullYear()} <span className="text-blue-500 font-bold">SmartLearn</span>. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;