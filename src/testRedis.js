const { redis } = require('./lib/redis');
const test = async () => {
    try {
        console.log('🔗 Connecting to Redis...');
        await redis.set('test', 'Connected to Redis');
        const value = await redis.get('test');
        console.log('Redis Test Value:', value);
    }
    catch (error) {
        console.error('❌ Redis Connection Error:', error.message);
    }
}
test();