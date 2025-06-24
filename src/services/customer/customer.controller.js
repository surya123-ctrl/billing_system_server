const { success, error } = require('../utils/responseHandler');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
if (!process.env.JWT_SECRET) { 
    console.error('❌ JWT_SECRET is undefined');
}   
const MenuItem = require('../../models/MenuItem');
const Customer = require('../../models/Customer');
const {v4: uuidv4} = require('uuid');
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

const startSlipController = async (req, res) => {
    const { shopId } = req.body;
    if (!shopId) {
        return error(res, 'Please provide shop ID', 400);
    }
    try {
        const slipId = `SLIP-${Math.floor(1000 + Math.random() * 9000)}`;
        const payload = {
            slipId,
            shopId,
            timestamp: new Date().toISOString(),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2)
        };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);
        const newCustomer = new Customer({
            token: jwtToken,
            slipId,
            shopId,
            status: 'active',
            paymentStatus: 'pending',
        });
        await newCustomer.save();
        return success(res, 'Slip started successfully', { newCustomer }, 200);
    } catch (err) {
        console.error('Error starting slip:', err.message);
        return error(res, 'Failed to start slip', 500);
    }
}

const postHandleScanner = async (req, res) => {
    const { shopId } = req.body;
    if(!shopId) return error(res, 'Missing ShopId', 400);
    try {
        const slipId = `SLIP-${uuidv4().slice(0, 8).toUpperCase()}`;
        const payload = {
            slipId, shopId,
            exp: Math.floor(Date.now() / 1000 + (60 * 60 * 2))
        }
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);
        console.log(payload, jwtToken);
        const newCustomer = new Customer({
            token: jwtToken,
            slipId,
            shopId,
            status: 'active',
            paymentStatus: 'unpaid'
        });
        await newCustomer.save();
        return success(res, 'New Slip Generated', {newCustomer})
    }
    catch (err) {
        console.error("❌ Error starting slip:", err);
        return error(res, "Failed to start slip", 500);
    }
}

const updateCustomerDetails = async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, email, phone },
            { new: true, runValidators: true, upsert: true}
        );

        if(!updatedCustomer) return error(res, 'Please scan QR again.', 404);
        return success(res, '', updatedCustomer)
    }
    catch (err) {
        console.error("❌ Error updating customer details:", err);
        return error(res, "Error updating customer details", 500);
    }
}

module.exports = {
    getMenuController,
    postHandleScanner,
    startSlipController,
    updateCustomerDetails
}