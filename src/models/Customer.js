const e = require('express');
const mongoose = require('mongoose');
const CustomerSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    slipId: {
        type: String,
        required: true,
        unique: true
    },
    scannedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 1000 * 60 * 120
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'cash_on_delivery', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);