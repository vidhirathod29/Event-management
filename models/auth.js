const mongoose = require('mongoose');

const auth = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  profile_image: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'deactivate'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'organization'],
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

const authModel = mongoose.model('User', auth);
module.exports = { authModel };