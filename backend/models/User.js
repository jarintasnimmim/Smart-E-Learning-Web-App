const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Name is required"],
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true,
        lowercase: true, // ইমেইল সবসময় ছোট হাতের অক্ষরে সেভ হবে
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: { 
        type: String, 
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    role: { 
        type: String, 
        enum: ['student', 'teacher', 'admin'], 
        default: 'student' 
    },
    // প্রোফাইল ইনফো
    avatar: { 
        type: String, 
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" // একটি ডিফল্ট প্রোফাইল আইকন
    }, 
    bio: { 
        type: String, 
        maxlength: [200, "Bio cannot be more than 200 characters"],
        default: "" 
    },
    phone: { 
        type: String, 
        default: "" 
    },
    // রিলেশনশিপ
    enrolledCourses: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    }]
}, { 
    timestamps: true // এটি আপনার জন্য createdAt এবং updatedAt ম্যানেজ করবে
});

// ইনডেক্সিং (ইমেইল দিয়ে দ্রুত ইউজার খুঁজে পাওয়ার জন্য)
UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);