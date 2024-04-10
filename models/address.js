const mongoose = require('mongoose');

const address = mongoose.Schema({
  user_id: {
    type: String,
  },
  country_id: {
    type: String,
  },
  state_id: {
    type: String,
  },
  city_id: {
    type: String,
  },
  address_line1: {
    type: String,
  },
  address_line2: {
    type: String,
  },
  zip_code: {
    type: String,
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

const addressModel = new mongoose.model('address', address);

module.exports = {
  addressModel,
};