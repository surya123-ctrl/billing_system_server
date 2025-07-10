const mongoose = require('mongoose');
const { Worker } = require('bullmq');
const { redis } = require('../lib/redis');
const Order = require('../models/Order');

require('dotenv').config();

async function startWorker() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('✅ MongoDB connected');
        const worker = new Worker(
            'order-status',
            async (job) => {
                const { orderId, status, paymentStatus } = job.data;
                console.log(`🔧 Processing orderId: ${orderId}, status: ${status}, paymentStatus: ${paymentStatus}`);

                const updates = {};
                if (status) updates.status = status;
                if (paymentStatus) updates.paymentStatus = paymentStatus;

                const previousOrder = await Order.findById(orderId);
                if (!previousOrder) throw new Error('Order not found');

                const updatedOrder = await Order.findOneAndUpdate(
                    { _id: orderId },
                    { $set: updates },
                    { new: true }
                );

                console.log(`✅ Order updated from "${previousOrder.status}" → "${status}"`);

                if (status === 'processing' && paymentStatus === 'paid') {
                    console.log('📨 Send email or perform next actions...');
                }
            },
            {
                connection: redis,
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 }
            }
        );

        worker.on('completed', async (job) => {
            console.log(`🎉 Job ${job.id} completed successfully`);

            try {
                await job.remove();
                console.log(`🧹 Job ${job.id} removed from Redis (completed)`);
            } catch (err) {
                console.error(`⚠️ Failed to remove job ${job.id} after completion:`, err.message);
            }
        });

        worker.on('failed', async (job, err) => {
            console.error(`❌ Job ${job.id} failed:`, err.message);
            if (job.attemptsMade >= (job.opts.attempts || 1)) {
                try {
                    await job.remove();
                    console.log(`🧹 Job ${job.id} removed from Redis (failed after max attempts)`);
                } catch (err) {
                    console.error(`⚠️ Failed to remove failed job ${job.id}:`, err.message);
                }
            } else {
                console.log(`🔁 Job ${job.id} failed (retrying... ${job.attemptsMade}/${job.opts.attempts})`);
            }
        });


    } catch (err) {
        console.error('❌ Worker failed to start:', err.message);
        process.exit(1);
    }
}

startWorker();
