const mongoose = require('mongoose');

const service = mongoose.Schema({
  user_id: {
    type: String,
  },
  event_manage_id: {
    type: String,
  },
  service_name: {
    type: String,
  },
  price: {
    type: Number,
  },
  service_description: {
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

const serviceModel = new mongoose.model('service', service);
module.exports = { serviceModel };