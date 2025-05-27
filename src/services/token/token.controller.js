const { generateToken, verifyToken } = require('./token.service');

const generateTokenController = (req, res) => {
    const { token, slipId } = generateToken();
    res.json({ token, slipId });
};

const verifyTokenController = (req, res) => {
    const { token } = req.params;
    const result = verifyToken(token);
    res.json(result)
}
module.exports = { generateTokenController, verifyTokenController };
