import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto p-10 min-h-screen">
            <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">About SmartLearn</h1>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 leading-relaxed text-gray-700">
                <p className="text-lg mb-4">
                    Welcome to <strong>SmartLearn</strong>, your ultimate destination for online education. Our platform is designed to provide high-quality courses that help students learn and grow in their professional careers.
                </p>
                <p className="text-lg mb-4">
                    This project was developed as part of our Internship Program by a dedicated team of three members: 
                    <strong> Jarin Tasnim Mim</strong>, <strong>Nurjahan Khanom Oishi</strong>, and <strong>Israt Jahan</strong>.
                </p>
                <p className="text-lg">
                    Our mission is to make learning accessible, affordable, and engaging for everyone, everywhere.
                </p>
            </div>
        </div>
    );
};

export default About;