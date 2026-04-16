const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

// ১. Middleware Setup
app.use(express.json()); 

// CORS কনফিগারেশন - এটি আপনার ফ্রন্টএন্ডকে এক্সেস দিবে
app.use(cors({
    origin: [
        "https://smart-e-learning-web-app.vercel.app", 
        "https://smart-e-learning-web-app-git-master-jarintasnimmims-projects.vercel.app",
        "http://localhost:5173" // লোকাল চেক করার জন্য
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));

// ২. Route Connection (পাথগুলো আপনার ফোল্ডার অনুযায়ী আছে কি না নিশ্চিত হয়ে নিন)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// ৩. MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log("✅ MongoDB Connected!");
    } catch (err) {
        console.error("❌ DB Error:", err.message);
    }
};

connectDB();

// ৪. Root Route
app.get('/', (req, res) => {
    res.status(200).json({
        message: "SmartLearn API is Live! 🚀",
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// ৫. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// ৬. Export for Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;