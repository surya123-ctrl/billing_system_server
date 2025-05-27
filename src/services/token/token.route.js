const express = require('express');
const {generateTokenController, verifyTokenController} = require('./token.controller');
const router = express.Router();
router.get('/generate-token', generateTokenController);
router.get('/verify-token/:token', verifyTokenController);
module.exports = router;