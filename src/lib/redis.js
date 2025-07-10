require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const Redis = require('ioredis');
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null
});

redis.on('error', (error) => {
    console.error('❌ Redis Connection Error:', error.message);
});

redis.on('connect', () => {
    console.log('✅ Successfully connected to Redis!');
});

module.exports = { redis };