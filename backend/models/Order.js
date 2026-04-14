const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number, required: true },
    tran_id: { type: String, required: true, unique: true }, // ইউনিক ট্রানজেকশন আইডি
    paymentStatus: { type: String, default: 'Pending' }, // Pending, Paid, Failed
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);