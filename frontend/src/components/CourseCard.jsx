import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react'; // lucide-react ব্যবহার করছি

const CourseCard = ({ course, isDashboard }) => {
  if (!course) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <img 
        src={course?.image || 'https://via.placeholder.com/300'} 
        alt={course?.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{course?.title}</h3>
        <p className="text-gray-500 mb-2 text-sm">By {course?.instructor}</p>
        
        {/* স্টার রেটিং সেকশন */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                fill={i < Math.round(course.averageRating || 0) ? "#eab308" : "none"} 
                className={i < Math.round(course.averageRating || 0) ? "text-yellow-500" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-gray-700">
            {course.averageRating ? course.averageRating.toFixed(1) : "0.0"}
          </span>
          <span className="text-xs text-gray-400">
            ({course.reviews?.length || 0})
          </span>
        </div>
        
        <div className="flex justify-between items-center border-t pt-4">
          <span className="text-2xl font-bold text-blue-600">${course?.price}</span>
          
          <Link 
            to={isDashboard ? `/watch/${course._id}` : `/course/${course._id}`} 
            className={`px-4 py-2 rounded-lg font-bold text-white transition-all ${
              isDashboard ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
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