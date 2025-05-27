const jwt = require('jsonwebtoken');
const { error } = require('../utils/responseHandler');
require('dotenv').config();
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return error(res, 'Authentication token is missing!', 401);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    }
    catch (err) {
        return error(res, "Invalid or expired token", 401);
    }
}
module.exports = { authenticate }