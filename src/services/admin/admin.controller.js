const Shop = require('../../models/Shop');
const User = require('../../models/User');
const MenuItem = require('../../models/MenuItem');
const { generateToken } = require('../token/token.service');
const { success, error } = require('../utils/responseHandler');
const bcrypt = require('bcrypt');
generateDefaultPassword = async function () {
    const defaultPass = 'Welcome@123';
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(defaultPass, salt);
}
// const hashPassword = await generateDefaultPassword();
const registerShopController = async (req, res) => {
  const {
    name,
    email,
    phone,
    address: { street, city, state, postalCode }
  } = req.body;
  console.log(req.body)

  // Validation
  if (!name?.trim()) return error(res, "Shop name is required", 400);
  if (!email?.includes('@')) return error(res, "Valid email is required", 400);
  if (!phone || phone.length < 10) return error(res, "Phone must be at least 10 digits", 400);
  if (!street?.trim() || !city?.trim() || !state?.trim() || !postalCode?.trim()) {
    return error(res, "All address fields are required", 400);
  }

  try {
    // Check for existing shop
    const existing = await User.findOne({ $or: [{ name }, { email }] });
    if (existing) {
      return error(res, `${name} or ${email} already exists`, 409);
    }

    // Create new user with role: 'shop'
    const newUser = new User({
      name,
      email,
      phone,
      role: 'user',
      password: 'Welcome@123',
      address: {
        street,
        city,
        state,
        postalCode,
        country: 'India'
      }
    });

    await newUser.save();

    return success(res, "Shop registered successfully", {
        newShop: {
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            address: newUser.address
        }
      
    }, 201);

  } catch (err) {
    console.error("DB Error:", err.message);
    return error(res, "❌ Failed to register shop", 500);
  }
};

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
        const shops = await User.find({ role: 'user' }).sort({ createdAt: -1 });
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