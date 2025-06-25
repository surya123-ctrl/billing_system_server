const { Worker } = require('bullmq');
const { OrderQueue } = require('../queue/orderQueue');
const Order = require('../../models/Order');
const { error, success } = require('../utils/responseHandler');
const worker = new Worker(
    'orderQueue',
    async (job) => {
        const { orderId, status, paymentStatus } = job.data;
        if(!orderId || (!status && !paymentStatus)) {
            return error(job, 'Missing required fields!', 400);
        }
        try {
            const updates = {};
            if(status) updates.status = status;
            if(paymentStatus) updates.paymentStatus = paymentStatus;

            const updateOrder = await Order.findOneAndUpdate(
                { _id: orderId },
                { $set: updates },
                { new: true }
            );

            if(!updateOrder) {
                return error(job, 'Order not found!', 404);
            }
            const event = {
                
            }
        }
        catch (err) {
            console.error("❌ DB Error:", err.message);
            return error(job, "Internal server error", 500);
        }
    }
)
