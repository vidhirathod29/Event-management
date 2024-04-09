const mongoose = require('mongoose');

const otp = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  otp: {
    type: Number,
    require: true,
  },
  expireTime: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
const otpModel = mongoose.model('Otp', otp);
module.exports = { otpModel };