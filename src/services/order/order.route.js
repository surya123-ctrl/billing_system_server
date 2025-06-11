const express = require('express');
const router = express.Router();
const { proceedCheckoutController } = require('./order.controller');
router.post('/proceed-checkout', proceedCheckoutController);
module.exports = router;