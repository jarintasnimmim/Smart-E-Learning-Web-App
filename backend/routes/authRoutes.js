const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const { register, login } = require('../controllers/authController');
const bcrypt = require('bcryptjs');
// ১. রেজিস্ট্রেশন রাউট
router.post('/register', register);

// ২. লগইন রাউট
router.post('/login', login);

// ৩. এনরোল রাউট
router.post('/enroll/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("Enrollment for User:", userId);

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (user.enrolledCourses.includes(req.params.id)) {
            return res.status(400).json({ msg: 'Already enrolled!' });
        }

        user.enrolledCourses.push(req.params.id);
        await user.save();
        res.json({ msg: 'Enrollment Successful! 🎉' });
    } catch (err) {
        console.error("Enrollment Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// ৪. ইউজারের কেনা কোর্সগুলো খুঁজে বের করার রাউট
router.get('/my-courses/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('enrolledCourses');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        res.json(user.enrolledCourses);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ৫. ইউজারের প্রোফাইল ডাটা পাওয়ার জন্য GET রাউট
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// ৬. ইউজারের প্রোফাইল নাম আপডেট করার জন্য PUT রাউট (নতুন যোগ করা হলো)
router.put('/profile/:id', async (req, res) => {
    try {
        const { name, bio, phone, avatar } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, bio, phone, avatar }, // এই সব ডাটা আপডেট হবে
            { new: true } 
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(500).send("Update Error");
    }
});

// পাসওয়ার্ড রিসেট করার রাউট
// পাসওয়ার্ড রিসেট করার সঠিক রাউট
router.post('/forgot-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        // ১. ইউজার আছে কি না চেক করা
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি!" });
        }

        // ২. নতুন পাসওয়ার্ডটি হ্যাশ (Hash) করা
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // ৩. আপডেট হওয়া ইউজার সেভ করা
        await user.save();

        res.json({ msg: "Password updated successfully! ✅" });
    } catch (err) {
        console.error("Reset Error:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;