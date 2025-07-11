const mongoose = require('mongoose');
const MenuItemSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    unit: {
        type: String,
        enum: ['piece', 'kg', 'g', 'litre', 'ml', 'packet', 'dozen', 'unit', 'custom'],
        default: 'unit'
    },
    active: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);