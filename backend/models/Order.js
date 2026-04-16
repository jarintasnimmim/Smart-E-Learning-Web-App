const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    currency: { 
        type: String, 
        default: 'BDT' 
    },
    tran_id: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Failed', 'Cancelled'], // নির্দিষ্ট কিছু ভ্যালু ফিক্সড করে দেওয়া হলো
        default: 'Pending' 
    },
    payment_method: { 
        type: String // bkash, nagad, rocket, or card (SSLCommerz থেকে পাওয়া যাবে)
    },
    val_id: { 
        type: String // SSLCommerz এর নিজস্ব ভ্যালিডেশন আইডি (ভবিষ্যতে রিফান্ড বা ট্র্যাকিংয়ের জন্য)
    }
}, { 
    timestamps: true // এটি createdAt এবং updatedAt দুটোই ম্যানেজ করবে
});

// ইনডেক্সিং (যাতে হাজার হাজার অর্ডারের মধ্যে দ্রুত সার্চ করা যায়)
OrderSchema.index({ tran_id: 1, userId: 1 });

module.exports = mongoose.model('Order', OrderSchema);