const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register Logic
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Terminal-e check korbo data ashche kina
        console.log("📥 Registration Attempt:", { name, email, role });

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            console.log("⚠️ User already exists:", email);
            return res.status(400).json({ msg: "User already exists" });
        }

        // 2. Password hash kora
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save User
        user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'student' 
        });

        await user.save();
        console.log("✅ User saved successfully in DB!");

        res.status(201).json({ msg: "User registered successfully!" });
    } catch (err) {
        // Asol error terminal-e dekhabe
        console.error("❌ Backend Register Error:", err.message);
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
};

// Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔑 Login Attempt:", email);

        // 1. User email diye khunje ber kora
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({ msg: "User does not exist" });
        }

        // 2. Password check kora
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Invalid Password");
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // 3. Login successful
        console.log("✅ Login Successful for:", email);
        // authController.js এর login রেসপন্স পরিবর্তন করুন:
res.json({
    msg: "✅ Login successful!",
    user: {
        _id: user._id, // এখানে id এর বদলে _id দিন
        name: user.name,
        email: user.email,
        role: user.role
    }
});
    } catch (err) {
        console.error("❌ Backend Login Error:", err.message);
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
};