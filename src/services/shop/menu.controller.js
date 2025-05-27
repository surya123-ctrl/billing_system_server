const MenuItem = require('../../models/MenuItem');
const { success, error } = require('../utils/responseHandler');
const addMenuController = async (req, res) => {
    const { shopId, name, description, price, unit } = req.body;
    if (!shopId || !name || !price) {
        return error(res, 'Missing required fields', 400);
    }
    try {
        const newItem = new MenuItem({ shopId, name, description, price, unit });
        await newItem.save();
        return success(res, `${name} saved successfully`, { item: newItem }, 201);
    }
    catch (error) {
        console.error("❌ DB Error:", err.message);
        error(res, 'Failed to add menu item', 500);
    }
}

const editMenuItemController = async (req, res) => {
    const { itemId } = req.params;
    const updatedData = req.body;
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(itemId, updatedData, { new: true });
        if (!updatedItem) {
            return error(res, "Item not found", 404);
        }
        return success(res, "Item updated successfully", updatedItem, 201);
    }
    catch (error) {
        console.error("❌ DB Error:", err.message);
        error(res, 'Failed to edit menu item', 500);
    }
}

const deleteMenuItemController = async (req, res) => {
    const { itemId } = req.params;
    console.log(itemId)
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(itemId);
        if (!deletedItem) {
            return error(res, "Item not found", 404);
        }
        return success(res, "Item deleted successfully");
    }
    catch (error) {
        console.error("❌ DB Error:", err.message);
        error(res, 'Failed to delete menu item', 500);
    }
}

module.exports = {
    addMenuController,
    editMenuItemController,
    deleteMenuItemController
}