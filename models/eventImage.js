const mongoose = require('mongoose');

const eventImage = new mongoose.Schema({
  event_manage_id: {
    type: Object,
  },
  event_image: {
    type: String,
  },
});

const eventImageModel = mongoose.model('event_image', eventImage);
module.exports = {
  eventImageModel,
};