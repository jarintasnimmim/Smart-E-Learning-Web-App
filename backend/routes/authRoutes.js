const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const { register, login } = require('../controllers/authController');
const bcrypt = require('bcryptjs');

// ১. রেজিস্ট্রেশন রাউট
router.post('/register', register);

// ২. লগইন রাউট
router.post('/login', login);

// ৩. এনরোল রাউট (Course Enrollment)
router.post('/enroll/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        const courseId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // চেক করা হচ্ছে কোর্সটি আগে থেকেই কেনা আছে কি না
        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ msg: 'Already enrolled!' });
        }

        user.enrolledCourses.push(courseId);
        await user.save();
        res.json({ msg: 'Enrollment Successful! 🎉', enrolledCourses: user.enrolledCourses });
    } catch (err) {
        console.error("Enrollment Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// ৪. ইউজারের কেনা কোর্সগুলো খুঁজে বের করা (Populate ব্যবহার করা হয়েছে)
router.get('/my-courses/:userId', async (req, res) => {
    try {
        // 'enrolledCourses' ফিল্ডটি দিয়ে কোর্স টেবিল থেকে ডাটা পপুলেট করা হচ্ছে
        const user = await User.findById(req.params.userId).populate('enrolledCourses');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        res.json(user.enrolledCourses);
    } catch (err) {
        console.error("Fetch Courses Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// ৫. ইউজারের প্রোফাইল ডাটা পাওয়া
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Profile Fetch Error:", err.message);
        res.status(500).send("Server Error");
    }
});

// ৬. প্রোফাইল আপডেট (Update Name, Bio, Phone, Avatar)
router.put('/profile/:id', async (req, res) => {
    try {
        const { name, bio, phone, avatar } = req.body;
        
        // সব ডাটা একসাথে আপডেট এবং পাসওয়ার্ড বাদে রিটার্ন
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, bio, phone, avatar }, 
            { new: true, runValidators: true } // runValidators নিশ্চিত করবে ডাটা টাইপ ঠিক আছে
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ msg: "User not found" });

        res.json(updatedUser);
    } catch (err) {
        console.error("Profile Update Error:", err.message);
        res.status(500).send("Update Error");
    }
});

// ৭. পাসওয়ার্ড রিসেট (Forgot Password)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি!" });
        }

        // নতুন পাসওয়ার্ড হ্যাশ করা
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ msg: "Password updated successfully! ✅" });
    } catch (err) {
        console.error("Password Reset Error:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;