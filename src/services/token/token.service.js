const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../../.env')});
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is undefined');
}
const JWT_SECRET = process.env.JWT_SECRET;
let orders = {};
const generateToken = () => {
    const payload = {
        // slipId: `SLIP-${Math.floor(1000 + Math.random() * 9000)}`,
        // shopId: `SECTOR_25_PANCHKULA`,
        timestamp: new Date().toISOString(),
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }
    console.log(payload);
    const token = jwt.sign(payload, JWT_SECRET);
    console.log(token);
    return token;
}

const verifyToken = (token) => {
    console.log("token: ", token)
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch(error) {
        return null
    }
}
module.exports = { generateToken, verifyToken }