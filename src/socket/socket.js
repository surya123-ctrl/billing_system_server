const { Server } = require('socket.io');
let io = null;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log(`🟢 Socket connected: ${socket.id}`);

        socket.on('joinShopRoom', (shopId) => {
            socket.join(shopId);
            console.log(`🛒 Shop ${shopId} joined by socket ${socket.id}`);
        });

        socket.on('joinOrderRoom', (orderId) => {
            socket.join(orderId);
            console.log(`📦 Order ${orderId} joined by ${socket.id}`);
        })

        socket.on('orderUpdateFromWorker', ({ shopId, orderId, order }) => {
            console.log(`📨 Worker pushed update for shop ${shopId}`);
            io.to(shopId).emit('orderUpdate', { order });
            io.to(orderId).emit('orderUpdateFromWorker', order);
        });

        socket.on('disconnect', () => {
            console.log(`🔴 Socket disconnected: ${socket.id}`);
        });
    });

    return io;
}

const getIO = () => {
    if (!io) throw new Error('Socket.IO not initialized');
    return io;
};

module.exports = { initSocket, getIO };