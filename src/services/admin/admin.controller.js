const Shop = require('../../models/Shop');
const User = require('../../models/User');
const MenuItem = require('../../models/MenuItem');
const { generateToken } = require('../token/token.service');
const { success, error } = require('../utils/responseHandler');
const registerShopController = async (req, res) => {
    const { name, address, phone } = req.body;
    if (!name) return error(res, 'Shop name is required', 400);
    if (!address) return error(res, 'Shop address is required', 400);
    if (!phone) return error(res, 'Shop phone is required', 400);

    try {
        const existing = await Shop.findOne({ name });
        if (existing) {
            return error(res, `${name} already exists in database.`, 409);
        }
        const newShop = new Shop({ name, address, phone });
        await newShop.save();
        return success(res, `${name} shop registered successfully whose address is ${address} & phone is ${phone}`, { newShop }, 201);
    }
    catch (error) {
        console.error('DB error: ', error.message);
        return error(res, 'Failed to register shop', 500)
    }
}

const loginAdminController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email & Password are required', 400);
    try {
        const admin = await User.findOne({ email });
        if (!admin) {
            return error(res, 'Invalid Credentials', 401);
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return error(res, 'Invalid Credentials', 401);
        }
        const token = generateToken(admin._id);
        return success(res, `Welcome ${admin.name}!`, { token, admin }, 201)
    }
    catch (err) {
        console.error("❌ Login Error:", err.message);
        return error(res, "Internal Server Error", 500);
    }
}

const signUpAdminController = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return error(res, "Missing required fields", 400);
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return error(res, "Email already taken", 409);
    }

    const newAdmin = new User({ name, email, password });
    await newAdmin.save();

    return success(res, "Admin created successfully!", { email }, 201);
  } 
  catch (err) {
    console.error("❌ DB Error:", err.message);
    return error(res, "Failed to create admin", 500);
  }
}

const shopController = async (req, res) => {
    try {
        const shops = await Shop.find({}).sort({ createdAt: -1 });
        return success(res, "", { shops }, 200);
    }
    catch (err) {
        console.error("❌ DB Error:", err.message);
        return error(res, "Failed to fetch shops", 500);
    }
}

const getMenuByShopController = async (req, res) => {
    const { shopId } = req.params;
    if(!shopId) return error(res, 'Missing Shop ID', 400);
    try {
        const items = await MenuItem.find({ shopId });
        if(!items.length) return success(res, 'No items found', [], 200);
        return success(res, '', { items }, 200);
    }
    catch (err) {
        console.error("❌ DB Error:", err.message);
        return error(res, "Failed to fetch menu items", 500);
    }

}

module.exports = {
    registerShopController,
    loginAdminController,
    signUpAdminController,
    shopController,
    getMenuByShopController
}