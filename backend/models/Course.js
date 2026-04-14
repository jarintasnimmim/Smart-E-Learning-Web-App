const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    videoUrl: { 
        type: String, 
        default: "https://www.youtube.com/embed/dQw4w9WgXcQ" 
    },
    description: { type: String },
    
    // রেটিং এবং রিভিউ সেকশন
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            userName: String,
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    averageRating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);