const express = require('express');
const { addMenuController, editMenuItemController, deleteMenuItemController } = require('./menu.controller');
const router = express.Router();
router.post('/add', addMenuController);
router.put('/edit/:itemId', editMenuItemController);
router.delete('/delete/:itemId', deleteMenuItemController)
module.exports = router;