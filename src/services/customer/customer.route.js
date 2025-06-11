const express = require('express');
const router = express.Router();

const { getMenuController, postHandleScanner, startSlipController } = require('./customer.controller');
router.get('/menu/:shopId', getMenuController);
router.post('/scanner/start', startSlipController);
router.post('/scanner/start', postHandleScanner);
module.exports = router;