const express = require('express');
const router = express.Router();
const SSLCommerzPayment = require('sslcommerz-lts');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors'); 
const Order = require('../models/Order');
const User = require('../models/User');

// SSLCommerz Credentials
const store_id = process.env.STORE_ID || 'testbox'; 
const store_passwd = process.env.STORE_PASS || 'qwerty'; 
const is_live = false; 

// ১. পেমেন্ট শুরু করার রাউট (Init)
router.post('/init', async (req, res) => {
    try {
        const { courseId, userId, amount, userName, userEmail } = req.body;
        const tran_id = uuidv4(); 

        const backend_url = process.env.BACKEND_URL || 'http://localhost:5000';

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
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(data);
        
        if (apiResponse.GatewayPageURL) {
            // ডাটাবেজে নতুন অর্ডার তৈরি
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

// ২. পেমেন্ট সফল হলে (Success Route) - এখানেই আপনার এরর হচ্ছিল
router.post('/success/:tranId', cors(), async (req, res) => {
    try {
        const { tranId } = req.params;
        console.log("Success hit for ID:", tranId);

        // ১. ট্রানজ্যাকশন আইডি দিয়ে ডাটাবেজ থেকে অর্ডার খোঁজা
        const order = await Order.findOne({ tran_id: tranId });
        
        if (!order) {
            console.log("Error: Order not found in DB for ID:", tranId);
            return res.status(404).send("Order not found");
        }

        // ২. অর্ডারের স্ট্যাটাস 'Paid' করা এবং পেমেন্ট মেথড সেভ করা
        order.paymentStatus = 'Paid';
        if (req.body.card_type) order.payment_method = req.body.card_type;
        if (req.body.val_id) order.val_id = req.body.val_id;
        await order.save();
        console.log("Order updated to Paid.");

        // ৩. ইউজারের এনরোলমেন্ট আপডেট করা
        if (order.userId && order.courseId) {
            await User.findByIdAndUpdate(order.userId, {
                $addToSet: { enrolledCourses: order.courseId }
            });
            console.log("User enrollment list updated.");
        }

        // ৪. ফ্রন্টএন্ড ড্যাশবোর্ডে রিডাইরেক্ট
        return res.redirect(`http://localhost:5173/dashboard?payment=success`);

    } catch (err) {
        console.error("FATAL SUCCESS ROUTE ERROR:", err.message);
        res.status(500).send(`Internal Server Error: ${err.message}`);
    }
});

// ৩. পেমেন্ট ফেইল হলে (Fail Route)
router.post('/fail/:tranId', cors(), async (req, res) => {
    try {
        const { tranId } = req.params;
        await Order.findOneAndUpdate({ tran_id: tranId }, { paymentStatus: 'Failed' });
        res.redirect(`http://localhost:5173/dashboard?payment=failed`);
    } catch (error) {
        res.redirect(`http://localhost:5173/dashboard`);
    }
});

// ৪. পেমেন্ট ক্যান্সেল হলে (Cancel Route)
router.post('/cancel', cors(), async (req, res) => {
    res.redirect(`http://localhost:5173/dashboard?payment=cancelled`);
});

module.exports = router;