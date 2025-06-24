const express = require('express');
const router = express.Router();
const { createOrderController, orderDetailsController } = require('./razorpay.controller');
router.post('/create-order', createOrderController);
router.get('/order-details', orderDetailsController);
module.exports = router;