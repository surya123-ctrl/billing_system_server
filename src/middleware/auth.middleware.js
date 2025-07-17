const { verifyToken } = require('../services/token/token.service');
const { error, success } = require('../services/utils/responseHandler'); 
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token) {
        return error(res, 'Please Provide Token!', 401);
    }
    const decoded = verifyToken(token);
    if(!decoded) {
        return error(res, 'Invalid or expired token!', 401);
    }
    console.log(decoded)
    req.user = decoded;
    next();
}

module.exports = { authMiddleware };