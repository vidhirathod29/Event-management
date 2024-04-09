const mongoose = require('mongoose');
const { Messages } = require('../utils/messages');
const logger = require('../logger/logger');
require('../models/service');

mongoose
  .connect('mongodb://localhost:27017/event-management')
  .then(() => logger.info(`${Messages.DATABASE_CONNECTION}`))
  .catch((err) => logger.error(`${Messages.NO_DATABASE_CONNECTION}`, err));
