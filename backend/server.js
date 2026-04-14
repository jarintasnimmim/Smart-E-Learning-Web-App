const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

// ১. Middleware Setup
app.use(express.json()); 
app.use(cors()); 
app.use(express.urlencoded({ extended: true }));

// ২. Route Connection (Route ফোল্ডার সঠিক পাথে থাকতে হবে)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// ৩. MongoDB Connection Setup
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is missing in Environment Variables!");
}

// কানেকশন লজিক (ভেরসেলের জন্য অপ্টিমাইজড)
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4 
})
.then(() => {
    console.log("✅ MongoDB Connected Successfully!");
})
.catch((err) => {
    console.log("❌ Connection Error Details:", err.message);
});

// ৪. Test Route
app.get('/', (req, res) => {
    res.send('SmartLearn Backend Server is Running and Database Connection is ' + 
    (mongoose.connection.readyState === 1 ? 'Active' : 'Disconnected'));
});

// ৫. Server Port Setup (Vercel-এর জন্য এখানে পরিবর্তন করা হয়েছে)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// এই লাইনটি ভেরসেলের জন্য সবচেয়ে গুরুত্বপূর্ণ
module.exports = app;