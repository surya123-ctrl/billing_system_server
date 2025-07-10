const express = require('express');
const { addMenuController, editMenuItemController, deleteMenuItemController, getMenuController, getProcessingOrdersController } = require('./menu.controller');
const router = express.Router();
router.post('/add', addMenuController);
router.put('/edit/:itemId', editMenuItemController);
router.delete('/delete/:itemId', deleteMenuItemController);
router.get('/getMenu/:shopId', getMenuController);
router.get('/getProcessingOrders/:shopId', getProcessingOrdersController);
module.exports = router;