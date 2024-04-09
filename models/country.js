const mongoose = require('mongoose');

const country = new mongoose.Schema({
  country_name: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  is_deleted: {
    type: Boolean,
  },
});

const countryModel = mongoose.model('Country', country);
module.exports = { countryModel };