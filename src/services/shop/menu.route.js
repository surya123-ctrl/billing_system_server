const express = require('express');
const { addMenuController, editMenuItemController, deleteMenuItemController, getMenuController } = require('./menu.controller');
const router = express.Router();
router.post('/add', addMenuController);
router.put('/edit/:itemId', editMenuItemController);
router.delete('/delete/:itemId', deleteMenuItemController);
router.get('/getMenu/:shopId', getMenuController);
module.exports = router;