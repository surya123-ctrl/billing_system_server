const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    }
}, {timestamps: true})

module.exports = mongoose.model('Shop', ShopSchema);