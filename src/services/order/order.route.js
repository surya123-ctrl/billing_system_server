const express = require('express');
const router = express.Router();
const { proceedCheckoutController, updateStatusController, getOrderController } = require('./order.controller');
router.post('/proceed-checkout', proceedCheckoutController);
router.post('/update-status', updateStatusController);
router.get('/getorderDetails/:orderId', getOrderController);
// router.get('/getOrderQueue/:shopId', getOrderQueueController);
module.exports = router;