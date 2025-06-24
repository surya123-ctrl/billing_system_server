const express = require('express');
require('dotenv').config();
const axios = require('axios');
const { error, success } = require('../utils/responseHandler');
const BASE_URL = process.env.CASHFREE_ENV === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

const createCashFreeOrder = async (req, res) => {
    try {
        const orderPayload = {
            order_amount: req.body.amount,
            order_currency: 'INR',
            customer_details: {
                customer_id: req.body.customer_id,
                customer_email: req.body.customer_email,
                customer_phone: req.body.customer_phone,
            },
            order_meta: {
                return_url: "http://localhost:3000/payment-status?order_id={order_id}"
            }
        };
        console.log(orderPayload)
        const orderHeaders = {
            'x-client-id': process.env.CASHFREE_CLIENT_ID,
            'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
            'x-api-version': '2022-09-01',
            'Content-Type': 'application/json',
        }
        const { data: orderData } = await axios.post(`${BASE_URL}/orders`, orderPayload, { headers: orderHeaders })
        console.log(orderData);
        return success(res, '', {paymentSessionId: orderData.payment_session_id, order_id: orderData.order_id});
    }
    catch(err) {
        console.error("❌ DB Error:", err.message);
        return error(res, "Failed to create cashfree order", 500);
    }
}

module.exports = {
    createCashFreeOrder
};