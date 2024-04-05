const { authModel } = require('../models/auth');
const { otpModel } = require('../models/otp');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { GeneralResponse } = require('../utils/response');
const { Messages } = require('../utils/messages');
const { GeneralError } = require('../utils/error');
const bcrypt = require('bcrypt');
const moment = require('moment');
const logger = require('../logger/logger');

const resetPassword = async (req, res, next) => {
  const email = req.user.email;
  const user = await authModel.findOne({ email: email });
  const { oldPassword, newPassword } = req.body;

  if (!user) {
    logger.error(Messages.USER_NOT_FOUND);
    next(
      new GeneralError(
        Messages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }

  const comparePassword = await bcrypt.compare(oldPassword, user.password);

  if (comparePassword) {
    const generatedPassword = await bcrypt.hash(newPassword, 10);
    const resetPassword = await authModel.updateOne(
      { email },
      { password: generatedPassword },
    );

    if (resetPassword) {
      logger.info(Messages.RESET_PASS_SUCCESS);
      next(
        new GeneralResponse(
          Messages.RESET_PASS_SUCCESS,
          StatusCodes.NO_CONTENT,
          undefined,
          RESPONSE_STATUS.SUCCESS,
        ),
      );
    }
    logger.error(Messages.SOMETHING_WENT_WRONG);
    next(
      new GeneralError(
        Messages.SOMETHING_WENT_WRONG,
        StatusCodes.BAD_REQUEST,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  } else {
    logger.error(Messages.INVALID_OLD_PASS);
    next(
      new GeneralError(
        Messages.INVALID_OLD_PASS,
        StatusCodes.BAD_REQUEST,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const verifyEmail = async (req, res, next) => {
  const email = req.body.email;
  const user = await authModel.findOne({ email: email });

  if (!user) {
    logger.error(Messages.USER_NOT_FOUND);
    next(
      new GeneralError(
        Messages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expireTime = moment().add(2, 'minute').format();
  const generatedOtp = new otpModel({
    email: email,
    otp: otp,
    expireTime: expireTime.toString(),
  });

  const newOtp = await generatedOtp.save();
  sendOtp(email, otp);

  if (!newOtp) {
    logger.error(Messages.OTP_GENERATE_FAIL);
    next(
      new GeneralError(
        Messages.OTP_GENERATE_FAIL,
        StatusCodes.BAD_REQUEST,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
  logger.info(Messages.OTP_SENT_SUCCESS);
  next(
    new GeneralError(
      Messages.OTP_SENT_SUCCESS,
      StatusCodes.OK,
      otp,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

const updatePassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  const findOtp = await otpModel.findOne({
    email: email,
    otp: otp,
  });

  if (findOtp) {
    const currentTime = moment().format('x');
    const otpValidTime = moment(findOtp.expireTime).format('x');

    if (otpValidTime <= currentTime) {
      logger.error(Messages.OTP_EXPIRE);
      next(
        new GeneralError(
          Messages.OTP_EXPIRE,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    const updatedPassword = await authModel.updateOne({
      email,
      password: hashPassword,
    });

    if (updatedPassword) {
      await otpModel.deleteOne({ otp });

      logger.info(Messages.PASS_UPDATE_SUCCESS);
      next(
        new GeneralResponse(
          Messages.PASS_UPDATE_SUCCESS,
          StatusCodes.OK,
          undefined,
          RESPONSE_STATUS.SUCCESS,
        ),
      );
    }
    logger.error(Messages.SOMETHING_WENT_WRONG);
    next(
      new GeneralError(
        Messages.SOMETHING_WENT_WRONG,
        StatusCodes.BAD_REQUEST,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
  logger.error(Messages.INVALID_OTP);
  next(
    new GeneralError(
      Messages.INVALID_OTP,
      StatusCodes.BAD_REQUEST,
      undefined,
      RESPONSE_STATUS.ERROR,
    ),
  );
};

module.exports = {
  resetPassword,
  verifyEmail,
  updatePassword,
};
