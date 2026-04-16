import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react'; 

const CourseCard = ({ course, isDashboard }) => {
  // কোর্স ডেটা না থাকলে কিছুই দেখাবে না
  if (!course) return null;

  // আইডি চেক করা হচ্ছে (কিছু সময় ডাটাবেসে _id থাকে, কিছু সময় শুধু id)
  const courseId = course._id || course.id;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* ইমেজ সেকশন */}
      <div className="relative">
        <img 
          src={course?.image || 'https://via.placeholder.com/300x200?text=No+Image+Available'} 
          alt={course?.title} 
          className="w-full h-48 object-cover"
        />
        {isDashboard && (
          <div className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            Enrolled
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1 truncate" title={course?.title}>
          {course?.title || "Untitled Course"}
        </h3>
        <p className="text-gray-500 mb-2 text-sm font-medium">By {course?.instructor || "Expert Instructor"}</p>
        
        {/* স্টার রেটিং সেকশন */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => {
              const ratingValue = course.averageRating || 0;
              return (
                <Star 
                  key={i} 
                  size={16} 
                  fill={i < Math.round(ratingValue) ? "#eab308" : "none"} 
                  className={i < Math.round(ratingValue) ? "text-yellow-500" : "text-gray-300"}
                />
              );
            })}
          </div>
          <span className="text-sm font-bold text-gray-700">
            {course.averageRating ? Number(course.averageRating).toFixed(1) : "0.0"}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            ({course.reviews?.length || 0})
          </span>
        </div>
        
        <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-2">
          <div className="flex flex-col">
            {isDashboard ? (
              <span className="text-xs font-bold text-green-600 uppercase">Lifetime Access</span>
            ) : (
              <span className="text-2xl font-black text-blue-600">${course?.price || 0}</span>
            )}
          </div>
          
          <Link 
            to={isDashboard ? `/watch/${courseId}` : `/course/${courseId}`} 
            className={`px-5 py-2.5 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg ${
              isDashboard 
                ? 'bg-green-600 hover:bg-green-700 shadow-green-100' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
            }`}
          >
            {isDashboard ? 'Watch Now' : 'Enroll Now'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;