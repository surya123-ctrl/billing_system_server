const User = require('../../models/User');
const { generateToken } = require('../token/token.service');
const { success, error } = require('../utils/responseHandler');
const loginController = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email || !password) return error(res, 'Email & Password are required', 400);
    try {
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            return error(res, 'Invalid Credentials', 401);
        }
        const isMatch = await user.comparePassword(password);
        console.log(isMatch)
        if (!isMatch) {
            return error(res, 'Invalid Credentials', 401);
        }
        const token = generateToken(user._id);
        return success(res, `Welcome ${user.name}!`, { token, user }, 201)
    }
    catch (err) {
        console.error("❌ Login Error:", err.message);
        return error(res, "Internal Server Error", 500);
    }
}
module.exports = {
    loginController
}