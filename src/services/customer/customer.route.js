const express = require('express');
const router = express.Router();

const { getMenuController, postHandleScanner, startSlipController, updateCustomerDetails } = require('./customer.controller');
router.get('/menu/:shopId', getMenuController);
// router.post('/scanner/start', startSlipController);
router.post('/scanner/start', postHandleScanner);
router.put('/:id', updateCustomerDetails);
module.exports = router;