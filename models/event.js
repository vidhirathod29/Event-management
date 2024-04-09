const mongoose = require('mongoose');

const event = new mongoose.Schema({
  user_id: {
    type: Object,
  },
  event_name: {
    type: String,
  },
  event_description: {
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
});

const eventModel = mongoose.model('event', event);
module.exports = { eventModel };