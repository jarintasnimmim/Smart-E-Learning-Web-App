import React from 'react';
import { Link } from 'react-router-dom';
// বিল্ড এরর ফিক্স করতে আইকনগুলোর নাম পরিবর্তন করা হয়েছে
import { FacebookIcon, LinkedinIcon, Mail, Phone, Globe } from 'lucide-react'; 

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-8 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        {/* লোগো এবং বর্ণনা */}
        <div className="space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">S</div>
            <h2 className="text-2xl font-bold text-white tracking-tight">SmartLearn</h2>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-sm mx-auto md:mx-0">
            Enhance your skills with the country’s top mentors. Learn anytime, from anywhere with our industry-leading curriculum.
          </p>
        </div>

        {/* কুইক লিঙ্কস */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-slate-100 uppercase tracking-widest">Quick Links</h3>
          <ul className="space-y-3">
            <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center justify-center md:justify-start gap-2">Home</Link></li>
            <li><Link to="/courses" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center justify-center md:justify-start gap-2">All Courses</Link></li>
            <li><Link to="/about" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center justify-center md:justify-start gap-2">About Us</Link></li>
            <li><Link to="/contact" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center justify-center md:justify-start gap-2">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* কন্টাক্ট ইনফো */}
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
            <div className="flex justify-center md:justify-start space-x-5 mt-6">
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-all duration-300">
                {/* FacebookIcon ব্যবহার করা হয়েছে */}
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-400 transition-all duration-300">
                {/* LinkedinIcon ব্যবহার করা হয়েছে */}
                <LinkedinIcon size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-all duration-300">
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* পেমেন্ট পার্টনার সেকশন */}
      <div className="max-w-7xl mx-auto px-6 mt-16 border-t border-slate-800/60 pt-10">
        <p className="text-center text-slate-500 text-[10px] mb-8 uppercase tracking-[0.3em] font-bold">
          Our Secure Payment Partners
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
          <img src="https://pathao.com/wp-content/uploads/2019/03/bkash-logo.png" alt="bKash" className="h-6 md:h-8 object-contain" />
          <img src="https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png" alt="Nagad" className="h-10 md:h-12 object-contain" />
          <img src="https://www.logo.wine/a/logo/Rocket_(mobile_banking_service)/Rocket_(mobile_banking_service)-Logo.wine.svg" alt="Rocket" className="h-8 md:h-10 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 md:h-5 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 md:h-8 object-contain" />
        </div>
      </div>

      <div className="mt-12 text-center text-slate-500 text-xs border-t border-slate-800/30 pt-8">
        <p>© {new Date().getFullYear()} <span className="text-blue-500 font-bold">SmartLearn</span>. All Rights Reserved. Built with ❤️ for Future Leaders.</p>
      </div>
    </footer>
  );
};

export default Footer;