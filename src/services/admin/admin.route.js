const express = require('express');
const { registerShopController, loginAdminController, signUpAdminController, shopController, getMenuByShopController } = require('./admin.controller');
const router = express.Router();
router.post('/login', loginAdminController);
router.post('/signup', signUpAdminController);
router.post('/shop/register', registerShopController);
router.get('/shops', shopController);
router.get('/menu/:shopId', getMenuByShopController);
module.exports = router;