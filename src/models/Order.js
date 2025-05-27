const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  id: {
    type: String,
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
    value: {
      type: Number,
      required: true,
      default: 1
    },
    unit: {
      type: String,
      enum: ['piece', 'kg', 'g', 'litre', 'ml', 'packet', 'dozen', 'unit', 'custom'],
      required: true,
      default: 'unit'
    }
  }
});


const OrderSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
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
  },
  completedAt: {
    type: Date,
    default: null
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
