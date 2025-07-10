const { Queue } = require('bullmq');
const { redis } = require('../lib/redis');
const orderStatusQueue = new Queue('order-status', { connection: redis });
module.exports = { orderStatusQueue };