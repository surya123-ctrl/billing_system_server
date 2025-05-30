const express = require('express');
const router = express.Router();
const { getMenuController, startSlipController } = require('./customer.controller');
router.get('/menu/:shopId', getMenuController);
router.post('/scanner/start', startSlipController);
module.exports = router;