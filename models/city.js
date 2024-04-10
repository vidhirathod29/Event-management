const mongoose = require('mongoose');

const city = new mongoose.Schema({
  state_id: {
    type: Object,
  },
  city_name: {
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
  is_deleted: {
    type: Boolean,
  },
});

const cityModel = mongoose.model('city', city);
module.exports = { cityModel };