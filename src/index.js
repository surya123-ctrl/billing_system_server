const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const { initSocket } = require('./socket/socket');
// Routes
const tokenRouter = require('./services/token/token.route');
const adminRouter = require('./services/admin/admin.route');
const menuRouter = require('./services/shop/menu.route');
const customerRouter = require('./services/customer/customer.route');
const orderRouter = require('./services/order/order.route');
const cashfreeRoute = require('./services/cashfree/cashfree.route');
const razorpayRoute = require('./services/razorpay/razorpay.route');
const authRoute = require('./services/auth/auth.route');
const shopDashboardRoute = require('./services/shop-dashboard/shopDashboard.route');
const { authMiddleware } = require('../src/middleware/auth.middleware');
// const orderRouter = require('./services/order/order.route');

// DB
const { connectDb } = require('./db/connect');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);


// Connect to MongoDB
connectDb();


initSocket(server);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/token', tokenRouter);
app.use('/admin', authMiddleware, adminRouter);
app.use('/menu', authMiddleware, menuRouter);
app.use('/customer', authMiddleware, customerRouter);
app.use('/order', authMiddleware, orderRouter);
app.use('/cashfree', cashfreeRoute);
app.use('/razorpay', razorpayRoute);
app.use('/auth', authRoute);
app.use('/shop-dashboard', authMiddleware, shopDashboardRoute);
// app.use('/scan', orderRouter);

const { errorHandler } = require('./services/common/errorHandler');
app.use(errorHandler);

// Start server
// app.listen(PORT, () => {
//   console.log(`✅ QR-SWEET Backend running at http://localhost:${PORT}`);
// });


server.listen(PORT, () => {
  console.log(`✅ QR-SWEET Backend running at http://localhost:${PORT}`);
});