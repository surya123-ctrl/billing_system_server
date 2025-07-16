const express = require('express');
const router = express.Router();
const { getTopItemsController, getRevenueByHourController } = require('./shopDashboard.controller');
router.get('/top-items/:shopId', getTopItemsController);
router.get('/revernue-by-hour/:shopId', getRevenueByHourController)
module.exports = router;