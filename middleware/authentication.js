const jwt = require('jsonwebtoken');
const { GeneralError } = require('../utils/error');
const StatusCodes = require('../utils/Http-Status');
const { RESPONSE_STATUS } = require('../utils/enum');
const { Messages } = require('../utils/messages');

const generateToken = (req) => {
  const token = jwt.sign(
    { email: req.email, password: req.password },
    process.env.PRIVATE_KEY,
  );
  return token;
};

const authentication = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token == null) {
        next(
          new GeneralError(
            Messages.TOKEN_VERIFY_FAILED,
            undefined,
            StatusCodes.UNAUTHORIZED,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }
      jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
        if (err) {
          logger.error(err);
          next(
            new GeneralError(
              Messages.TOKEN_EXPIRED,
              undefined,
              StatusCodes.FORBIDDEN,
              RESPONSE_STATUS.ERROR,
            ),
          );
        }
        req.user = user;
        next();
      });
    }
  } catch (error) {
    next(
      new GeneralError(
        `${Messages.SOMETHING_WENT_WRONG} while authentication..`,
        StatusCodes.SOMETHING_WENT_WRONG,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

module.exports = {
  generateToken,
  authentication,
};