const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    slipId: {
        type: String,
        required: true,
        unique: true
    },
    shopId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid'
    },
    name:{
        type: String,
    },
    email: {
        type: String
    },
    phone: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);