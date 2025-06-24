// const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// const UserSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     role: {
//         type: String,
//         enum: ['admin', 'user'],
//         default: 'user'
//     },
// }, { timestamps: true });

// // Use a regular function to access `this`


// module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'India'
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  address: {
    type: AddressSchema,
    validate: {
      validator: function(v) {
        return this.role === 'user' ? v !== null && v !== undefined : true;
      },
      message: props => 'Address is required for shop owners'
    }
  },
  phone: {
    type: String,
    required: function () {
      return this.role === 'user';
    },
    validate: {
      validator: function (v) {
        return this.role === 'user' ? v?.length > 9 : true;
      },
      message: props => 'Phone number is required for shops'
    }
  },
}, { timestamps: true });
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Use function() to access `this.password`
UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}
UserSchema.methods.generateDefaultPassword = async function () {
    return 'Welcome@123'
}
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);