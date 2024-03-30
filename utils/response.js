const logger = require('../logger/logger');

class GeneralResponse {
  constructor(message, statusCode = '', data = '', status) {
    logger.info(message);
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.status = status;
  }
}

module.exports = {
  GeneralResponse,
};