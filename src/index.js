const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Routes
const tokenRouter = require('./services/token/token.route');
const adminRouter = require('./services/admin/admin.route');
const menuRouter = require('./services/shop/menu.route');
const customerRouter = require('./services/customer/customer.route');
// const orderRouter = require('./services/order/order.route');

// DB
const { connectDb } = require('./db/connect');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDb();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/token', tokenRouter);
app.use('/admin', adminRouter);
app.use('/menu', menuRouter);
app.use('/customer', customerRouter);
// app.use('/scan', orderRouter);

const { errorHandler } = require('./services/common/errorHandler');
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ QR-SWEET Backend running at http://localhost:${PORT}`);
});