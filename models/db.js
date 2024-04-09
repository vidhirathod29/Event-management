const mongoose = require('mongoose');
const { Messages } = require('../utils/messages');
 require('../models/state')
 require('../models/country');
 require('../models/city');
const logger = require('../logger/logger')

mongoose
  .connect('mongodb://localhost:27017/event-management')
  .then(() => logger.info(`${Messages.DATABASE_CONNECTION}`))
  .catch((err) => logger.error(`${Messages.NO_DATABASE_CONNECTION}`, err));