import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <div className="container mx-auto p-10 min-h-screen">
            <h1 className="text-4xl font-bold text-blue-600 mb-10 text-center">Contact Us</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Email */}
                <div className="bg-white p-6 rounded-2xl shadow-md text-center border border-gray-100">
                    <Mail className="mx-auto text-blue-600 mb-4" size={40} />
                    <h3 className="font-bold text-xl mb-2">Email Us</h3>
                    <p className="text-gray-600">support@smartlearn.com</p>
                </div>
                {/* Phone */}
                <div className="bg-white p-6 rounded-2xl shadow-md text-center border border-gray-100">
                    <Phone className="mx-auto text-blue-600 mb-4" size={40} />
                    <h3 className="font-bold text-xl mb-2">Call Us</h3>
                    <p className="text-gray-600">+880 1234 567890</p>
                </div>
                {/* Address */}
                <div className="bg-white p-6 rounded-2xl shadow-md text-center border border-gray-100">
                    <MapPin className="mx-auto text-blue-600 mb-4" size={40} />
                    <h3 className="font-bold text-xl mb-2">Visit Us</h3>
                    <p className="text-gray-600">Dhaka, Bangladesh</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;