const mongoose = require('mongoose');
const { Messages } = require('../utils/messages');

mongoose
  .connect('mongodb://localhost:27017/event-management')
  .then(() => console.log(`${Messages.DATABASE_CONNECTION}`))
  .catch((err) => console.error(`${Messages.NO_DATABASE_CONNECTION}`, err));