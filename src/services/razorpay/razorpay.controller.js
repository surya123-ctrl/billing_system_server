require('dotenv').config();
const Razorpay = require('razorpay');
const { error, success } = require('../utils/responseHandler');
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
const createOrderController = async (req, res) => {
    const { name, email, phone, amount } = req.body;
    if(!name || !email || !phone || !amount) return error(res, 'Missing Required Fields', 400);
    try {
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
            payment_capture: 1,
            notes: { name, email, phone }
        });
        return success(res, '', {orderId: order.id, amount: order.amount, currency: order.currency, razorpayKey: process.env.RAZORPAY_KEY_ID, customer: { name, email, phone }});
    }
    catch(err) {
        console.error("Razorpay Order Error:", err);
        error(res, 'Failed to create razorpay order', 500);
    }
}

const orderDetailsController = async (req, res) => {
    console.log('ajhdjs')
    const { orderId } = req.query;
    if(!orderId) return error(res, 'Missing orderId!', 400);
    try {
        const order = await razorpay.orders.fetch(orderId);
        console.log(order);
        return success(res, '', {orderId: order.id, amount: order.amount / 100, currency: order.currency, notes: order.notes});
    }
    catch(err) {
        console.error("Failed to fetch razorpay order details:", err);
        error(res, 'Failed to fetch razorpay order details', 500);
    }
}

module.exports = {
    createOrderController,
    orderDetailsController
}