const queue = require('bullmq');
const { redis } = require('../lib/redis');
const orderQueue = new queue.Queue('orderQueue', {
    connection: redis,
});
module.exports = { orderQueue };