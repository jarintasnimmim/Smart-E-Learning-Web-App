const express = require('express');
const router = express.Router();
const SSLCommerzPayment = require('sslcommerz-lts');
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');
const User = require('../models/User');

// এনভায়রনমেন্ট ভেরিয়েবল ব্যবহার করা ভালো (Security-র জন্য)
const store_id = process.env.STORE_ID || 'testbox'; 
const store_passwd = process.env.STORE_PASS || 'qwerty'; 
const is_live = false; 

// ১. পেমেন্ট শুরু করার রাউট
router.post('/init', async (req, res) => {
    try {
        const { courseId, userId, amount, userName, userEmail } = req.body;
        const tran_id = uuidv4(); 

        // ব্যাকএন্ড এবং ফ্রন্টএন্ড ইউআরএল সেটআপ
        const backend_url = process.env.BACKEND_URL || 'http://localhost:5000';
        const frontend_url = process.env.FRONTEND_URL || 'http://localhost:5173';

        const data = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: tran_id,
            success_url: `${backend_url}/api/payment/success/${tran_id}`,
            fail_url: `${backend_url}/api/payment/fail/${tran_id}`,
            cancel_url: `${backend_url}/api/payment/cancel`,
            ipn_url: `${backend_url}/api/payment/ipn`,
            shipping_method: 'No',
            product_name: 'Course Enrollment',
            product_category: 'Education',
            product_profile: 'general',
            cus_name: userName || 'Learner',
            cus_email: userEmail || 'test@test.com',
            cus_add1: 'Dhaka',
            cus_city: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01700000000',
            ship_name: userName,
            ship_add1: 'Dhaka',
            ship_city: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        
        const apiResponse = await sslcz.init(data);
        if (apiResponse.GatewayPageURL) {
            // পেন্ডিং অর্ডার সেভ
            const newOrder = new Order({ 
                userId, 
                courseId, 
                amount, 
                tran_id,
                paymentStatus: 'Pending' 
            });
            await newOrder.save();
            
            res.send({ url: apiResponse.GatewayPageURL });
        } else {
            res.status(400).send({ message: "SSLCommerz Initiation Failed" });
        }
    } catch (error) {
        console.error("Payment Init Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// ২. পেমেন্ট সফল হলে
router.post('/success/:tranId', async (req, res) => {
    try {
        const { tranId } = req.params;
        const frontend_url = process.env.FRONTEND_URL || 'http://localhost:5173';

        const order = await Order.findOne({ tran_id: tranId });
        
        if (order) {
            // ১. অর্ডারের স্ট্যাটাস Paid করা
            order.paymentStatus = 'Paid';
            await order.save();

            // ২. ইউজারের enrolledCourses-এ কোর্সটি যোগ করা ($addToSet ডুপ্লিকেট রোধ করে)
            await User.findByIdAndUpdate(order.userId, {
                $addToSet: { enrolledCourses: order.courseId }
            });

            // ৩. ফ্রন্টএন্ডে রিডাইরেক্ট (সফলতা মেসেজসহ)
            return res.redirect(`${frontend_url}/dashboard?payment=success`);
        } else {
            return res.status(404).send("Transaction not found");
        }
    } catch (err) {
        console.error("Success Route Error:", err);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=error`);
    }
});

// ৩. পেমেন্ট ফেইল হলে
router.post('/fail/:tranId', async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || 'http://localhost:5173';
    try {
        await Order.findOneAndDelete({ tran_id: req.params.tranId });
        res.redirect(`${frontend_url}/dashboard?payment=failed`);
    } catch (error) {
        res.redirect(`${frontend_url}/dashboard`);
    }
});

module.exports = router;