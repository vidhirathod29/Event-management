const mongoose = require('mongoose');

const state = new mongoose.Schema({
  country_id: {
    type: Object,
  },
  state_name: {
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

const stateModel = mongoose.model('State', state);
module.exports = { stateModel };