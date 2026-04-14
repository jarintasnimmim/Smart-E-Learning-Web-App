const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['student', 'teacher', 'admin'], 
        default: 'student' 
    },
    // --- নতুন যুক্ত করা ফিল্ডস ---
    avatar: { 
        type: String, 
        default: "" 
    }, 
    bio: { 
        type: String, 
        default: "" 
    },
    phone: { 
        type: String, 
        default: "" 
    },
    // -------------------------
    enrolledCourses: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);