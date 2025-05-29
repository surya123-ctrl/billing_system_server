const { success, error } = require('../utils/responseHandler');
const MenuItem = require('../../models/MenuItem');
const getMenuController = async (req, res) => {
    const { shopId } = req.params;
    const { itemState } = req.query;
    if(!shopId) error(res, 'Please Provide shop id', 500);
    try {
        let menuItems;
        switch(itemState) {
            case 'active':
                menuItems = await MenuItem.find({ shopId, active: true });
                break;
            case 'inactive':
                menuItems = await MenuItem.find({ shopId, active: false });
                break;
            default:
                menuItems = await MenuItem.find({ shopId });
        }
        return success(res, '', { menuItems }, 200);
    }
    catch (error) {
        console.error('DB error: ', error.message);
        return error(res, 'Failed to fetch menu items', 500)
    }
}

module.exports = {
    getMenuController
}