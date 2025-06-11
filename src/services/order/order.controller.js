const MenuItem = require('../../models/MenuItem');
const Order = require('../../models/Order');
const { error, success } = require('../utils/responseHandler');
const proceedCheckoutController = async (req, res) => {
    const { token, shopId, slipId, userId, cartArray } = req.body;
    if(!token || !shopId || !slipId || !userId || !Array.isArray(cartArray)) error(res, "Missing fields!", 400);
    try {
        const itemIds = cartArray.map(i => i.itemId);
        const dbItems = await MenuItem.find({ _id: { $in: itemIds }, shopId});
        console.log("DbItems", dbItems)
        const itemMap = {};
        dbItems.forEach(item => {
            itemMap[item._id.toString()] = item;
        });
        console.log("Item Map:", itemMap);
        let totalAmount = 0;
        const finalItems = [];
        for(const item of cartArray) {
            const dbItem = itemMap[item.itemId];
            if(!dbItem) continue;
            const price = parseFloat(dbItem.price.$numberDecimal || dbItem.price);
            const quantity = parseInt(item.quantity);
            finalItems.push({
                itemId: item.itemId,
                name: dbItem.name,
                price,
                quantity
            });
            totalAmount += price * quantity;
        }
        console.log("total", totalAmount)
        console.log("final item", finalItems)
        const newOrder = new Order({
            token,
            slipId,
            shopId,
            items: finalItems,
            totalAmount,
            status: 'pending',
            paymentStatus: 'unpaid'
        });
        await newOrder.save();
        return success(res, '', { orderid: newOrder._id, totalAmount });
    }
    catch (err) {
        console.error("❌ DB Error:", err.message);
        return error(res, "Failed to calculate total", 500);
    }
}

module.exports = {
    proceedCheckoutController
}