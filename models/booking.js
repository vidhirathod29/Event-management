const mongoose = require('mongoose');
const { STATUS } = require('../utils/enum');

const booking = new mongoose.Schema({
  user_id: {
    type: String,
  },
  address_id: {
    type: String,
  },
  event_manage_id: {
    type: String,
  },
  event_date: {
    type: Date,
  },
  additional_information: {
    type: String,
  },
  status: {
    type: String,
    enum: [STATUS.PENDING, STATUS.CANCELLED, STATUS.APPROVED],
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

const bookingModel = mongoose.model('booking', booking);
module.exports = {
  bookingModel,
};
