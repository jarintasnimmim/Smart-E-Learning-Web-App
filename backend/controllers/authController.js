const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // টোকেন এর জন্য

// Register Logic
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        console.log("📥 Registration Attempt:", { name, email, role });

        // ১. ইউজার অলরেডি আছে কি না চেক
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists with this email" });
        }

        // ২. পাসওয়ার্ড হ্যাশ করা
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ৩. ইউজার সেভ
        user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'student' 
        });

        await user.save();
        console.log("✅ User saved successfully!");

        res.status(201).json({ msg: "Registration successful! Please login." });
    } catch (err) {
        console.error("❌ Register Error:", err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

// Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔑 Login Attempt:", email);

        // ১. ইমেইল চেক
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials (Email not found)" });
        }

        // ২. পাসওয়ার্ড তুলনা
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials (Wrong Password)" });
        }

        // ৩. JWT টোকেন তৈরি (সিকিউরিটির জন্য)
        // .env ফাইল এ JWT_SECRET="your_secret_key" থাকতে হবে
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'smartlearn_secret_key',
            { expiresIn: '24h' }
        );

        console.log("✅ Login Successful:", email);

        // ৪. রেসপন্স পাঠানো
        res.json({
            msg: "✅ Login successful!",
            token, // ফ্রন্টএন্ডে এই টোকেনটি সেভ করে রাখবেন
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar || ""
            }
        });

    } catch (err) {
        console.error("❌ Login Error:", err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};