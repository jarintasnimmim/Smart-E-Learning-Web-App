const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

// ১. Middleware Setup
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// ২. ফাইনাল CORS সমাধান (এটি আর ব্লক করবে না)
app.use(cors({
    origin: true, // এটি সব অরিজিনকে অনুমতি দিবে, ফলে 'null' এরর আর আসবে না
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// ৩. Route Connection
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// ৪. MongoDB Connection
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

// ৫. Root Route
app.get('/', (req, res) => {
    res.status(200).json({
        message: "SmartLearn API is Live!",
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// ৬. Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// ৭. Server Start
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;