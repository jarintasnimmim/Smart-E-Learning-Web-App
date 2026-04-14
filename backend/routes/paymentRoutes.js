const express = require('express');
const router = express.Router();
const SSLCommerzPayment = require('sslcommerz-lts');
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');
const User = require('../models/User'); // ইউজার মডেল উপরেই ইম্পোর্ট করে নিলাম

// টেস্ট ক্রেডেনশিয়াল (Sandbox Mode)
const store_id = 'testbox'; 
const store_passwd = 'qwerty'; 
const is_live = false; 

// ১. পেমেন্ট শুরু করার রাউট
router.post('/init', async (req, res) => {
    try {
        const { courseId, userId, amount, userName, userEmail } = req.body;
        const tran_id = uuidv4(); 

        const data = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: tran_id,
            success_url: `http://localhost:5000/api/payment/success/${tran_id}`,
            fail_url: `http://localhost:5000/api/payment/fail/${tran_id}`,
            cancel_url: `http://localhost:5000/api/payment/cancel`,
            ipn_url: `http://localhost:5000/api/payment/ipn`,
            shipping_method: 'No',
            product_name: 'Course',
            product_category: 'Education',
            product_profile: 'general',
            cus_name: userName || 'Customer',
            cus_email: userEmail || 'test@test.com',
            cus_add1: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        
        sslcz.init(data).then(async (apiResponse) => {
            if (apiResponse.GatewayPageURL) {
                // ডাটাবেসে পেন্ডিং অর্ডার সেভ
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
                res.status(400).send({ message: "SSLCommerz initiation failed" });
            }
        });
    } catch (error) {
        console.error("Payment Init Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// ২. পেমেন্ট সফল হলে (SSLCommerz এখান থেকে POST রিকোয়েস্ট পাঠাবে)
router.post('/success/:tranId', async (req, res) => {
    try {
        const { tranId } = req.params;

        // ট্রানজেকশন আইডি দিয়ে অর্ডার খুঁজে বের করা
        const order = await Order.findOne({ tran_id: tranId });
        
        if (order) {
            // অর্ডারের স্ট্যাটাস Paid করা
            await Order.updateOne({ tran_id: tranId }, { $set: { paymentStatus: 'Paid' } });

            // ইউজারের enrolledCourses লিস্টে এই কোর্সটি যোগ করা
            await User.findByIdAndUpdate(order.userId, {
                $addToSet: { enrolledCourses: order.courseId }
            });

            // সাকসেস মেসেজসহ সরাসরি ফ্রন্টএন্ড ড্যাশবোর্ডে পাঠানো
            return res.redirect(`http://localhost:5173/dashboard`);
        } else {
            return res.status(404).send("Order not found");
        }
    } catch (err) {
        console.error("Success Route Error:", err);
        res.redirect(`http://localhost:5173/dashboard?payment=error`);
    }
});

// ৩. পেমেন্ট ফেইল হলে
router.post('/fail/:tranId', async (req, res) => {
    await Order.deleteOne({ tran_id: req.params.tranId }); // ফেইল করলে অর্ডার রিমুভ করে দিতে পারেন
    res.redirect(`http://localhost:5173/dashboard?payment=failed`);
});

module.exports = router;