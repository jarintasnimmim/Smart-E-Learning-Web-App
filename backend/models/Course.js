const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Course title is required"], 
        trim: true 
    },
    instructor: { 
        type: String, 
        required: [true, "Instructor name is required"] 
    },
    price: { 
        type: Number, 
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    image: { 
        type: String,
        default: "https://via.placeholder.com/300"
    },
    videoUrl: { 
        type: String, 
        // ইউটিউব এম্বেড ফরম্যাট ডিফল্ট হিসেবে রাখা হলো
        default: "https://www.youtube.com/embed/dQw4w9WgXcQ" 
    },
    description: { 
        type: String,
        required: [true, "Please provide a course description"]
    },
    
    // রেটিং এবং রিভিউ সেকশন
    reviews: [
        {
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User',
                required: true
            },
            userName: String,
            rating: { 
                type: Number, 
                required: true, 
                min: 1, 
                max: 5 
            },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    averageRating: { 
        type: Number, 
        default: 0,
        set: v => Math.round(v * 10) / 10 // এটি রেটিংকে ১ দশমিক ঘরে রাখবে (যেমন: ৪.৫)
    }
}, { 
    timestamps: true // এটি অটোমেটিক 'createdAt' এবং 'updatedAt' তৈরি করবে
});

module.exports = mongoose.model('Course', CourseSchema);