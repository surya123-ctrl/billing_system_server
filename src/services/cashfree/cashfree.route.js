const express = require('express');
const router = express.Router();
const { createCashFreeOrder } = require('./cashfree.controller');
router.post('/create-order', createCashFreeOrder);
// router.post('verify-payment', verifyCashFreePayment)
module.exports = router;