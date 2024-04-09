const mongoose = require('mongoose');
const { ROLES, STATUS } = require('../utils/enum');

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
    enum: [STATUS.ACTIVE, STATUS.DEACTIVATE],
  },
  role: {
    type: String,
    enum: [ROLES.ADMIN, ROLES.ORGANIZATION, ROLES.USER],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const authModel = mongoose.model('User', auth);
module.exports = { authModel };
