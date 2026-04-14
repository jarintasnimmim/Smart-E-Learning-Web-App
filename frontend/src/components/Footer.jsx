import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* লোগো এবং বর্ণনা */}
        <div>
          <h2 className="text-2xl font-bold text-blue-400 mb-4">📖 SmartLearn</h2>
          <p className="text-gray-400">
            Enhance your skills with the country’s top mentors. Learn anytime, from anywhere.
          </p>
        </div>

        {/* কুইক লিঙ্কস */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
            <li><Link to="/courses" className="hover:text-blue-400 transition">Courses</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
          </ul>
        </div>

        {/* কন্টাক্ট ইনফো */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-400">Email: support@smartlearn.com</p>
          <p className="text-gray-400">Phone: +880 1234 567 890</p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <span className="cursor-pointer hover:text-blue-400">Facebook</span>
            <span className="cursor-pointer hover:text-blue-400">LinkedIn</span>
          </div>
        </div>
      </div>

      {/* পেমেন্ট পার্টনার সেকশন */}
      <div className="max-w-7xl mx-auto px-4 mt-12 border-t border-gray-800 pt-8">
        <p className="text-center text-gray-500 text-sm mb-6 uppercase tracking-widest font-semibold">
          Our Secure Payment Partners
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          <img src="https://pathao.com/wp-content/uploads/2019/03/bkash-logo.png" alt="bKash" className="h-8 object-contain" />
          <img src="https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png" alt="Nagad" className="h-12 object-contain" />
          <img src="https://www.logo.wine/a/logo/Rocket_(mobile_banking_service)/Rocket_(mobile_banking_service)-Logo.wine.svg" alt="Rocket" className="h-10 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-5 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8 object-contain" />
        </div>
      </div>

      <div className="mt-10 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} SmartLearn. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;