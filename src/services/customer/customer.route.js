const express = require('express');
const router = express.Router();
const { getMenuController } = require('./customer.controller');
router.get('/menu/:shopId', getMenuController);
module.exports = router;