const mongoose = require('mongoose');
const MenuItem = require('./MenuItem');

const ItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
});


const OrderSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  slipId: {
    type: String,
    required: true,
  },
  shopId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  customerId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  items: [ItemSchema],
  totalAmount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  }
}, {
  timestamps: true
});

OrderSchema.set('toJSON', {
  transform: function (doc, ret) {
    if (ret.totalAmount) ret.totalAmount = parseFloat(ret.totalAmount.toString());
    if (ret.items && Array.isArray(ret.items)) {
      ret.items = ret.items.map(item => ({
        ...item,
        price: parseFloat(item.price.toString())
      }));
    }
    return ret;
  }
});

module.exports = mongoose.model('Order', OrderSchema);
