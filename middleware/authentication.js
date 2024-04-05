const jwt = require('jsonwebtoken');
const { GeneralError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { Messages } = require('../utils/messages');

const generateToken = (req) => {
  const token = jwt.sign(
    { email: req.email, password: req.password },
    process.env.PRIVATE_KEY,
  );
  return token;
};

const authorization = (roles) => {
  return (req, res, next) => {
    try {
      const token = req.header('Authorization');

      if (!token) {
        next(
          new GeneralError(
            Messages.TOKEN_VERIFY_FAILED,
            StatusCodes.UNAUTHORIZED,
            undefined,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }
      const verified = jwt.verify(token, process.env.PRIVATE_KEY);
      req.user = verified;

      if (roles.length > 0 && roles.some((role) => role === verified.role)) {
        next();
      } else {
        next(
          new GeneralError(
            Messages.USER_UNAUTHORIZED,
            StatusCodes.UNAUTHORIZED,
            undefined,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }
    } catch (err) {
      next(
        new GeneralError(
          Messages.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
  };
};

module.exports = {
  generateToken,
  authorization,
};