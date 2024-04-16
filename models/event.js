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
  updated_at: {
    type: Date,
    default: Date.now,
  },
  is_deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const eventModel = mongoose.model('event', event);
module.exports = { eventModel };