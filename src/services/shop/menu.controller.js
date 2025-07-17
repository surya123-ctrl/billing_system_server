const MenuItem = require('../../models/MenuItem');
const Order = require('../../models/Order');
const Customer = require('../../models/Customer')
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

const getMenuController = async (req, res) => {
    const { shopId } = req.params;
    if (!shopId) return error(res, 'Missing Shop ID', 400);
    try {
        const items = await MenuItem.find({ shopId });
        if (!items.length) return success(res, 'No items found', [], 200);
        console.log(items)
        return success(res, '', { items }, 200);
    }

    catch (err) {
        console.error("❌ DB Error:", err.message);
        return error(res, "Failed to fetch menu items", 500);
    }
}

const getProcessingOrdersController = async (req, res) => {
  const { shopId } = req.params;
  const { status, paymentStatus } = req.query;

  if (!shopId) return error(res, '❌ Missing Shop ID', 400);

  const validStatuses = ['pending', 'processing', 'completed'];
  const validPaymentStatuses = ['unpaid', 'paid'];

  try {
    const filter = { shopId };

    if (status) {
      if (!validStatuses.includes(status)) {
        return error(res, '❌ Invalid status value', 400);
      }
      filter.status = status;
    }

    if (paymentStatus) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return error(res, '❌ Invalid paymentStatus value', 400);
      }
      filter.paymentStatus = paymentStatus;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('customerId', 'name email phone'); // send only required fields

    return success(res, '', {
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    return error(res, 'Failed to fetch orders', 500);
  }
};

module.exports = {
    addMenuController,
    editMenuItemController,
    deleteMenuItemController,
    getMenuController,
    getProcessingOrdersController
}