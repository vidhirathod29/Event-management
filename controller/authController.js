const { authModel } = require('../models/auth');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { GeneralResponse } = require('../utils/response');
const { Messages } = require('../utils/messages');
const { GeneralError } = require('../utils/error');
const { generateToken } = require('../middleware/authentication');
const bcrypt = require('bcrypt');
const logger = require('../logger/logger');
const { otpModel } = require('../models/otp');
const moment = require('moment');

const registration = async (req, res, next) => {
  const { name, email, phoneNumber, status, role } = req.body;
  const existingUser = await authModel.findOne({ email: req.body.email });

  if (existingUser) {
    logger.error(`User ${Messages.ALREADY_EXIST}`);
    next(
      new GeneralError(
        `User ${Messages.ALREADY_EXIST}`,
        StatusCodes.CONFLICT,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }

  if (!req.file) {
    logger.error(`Image ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Image ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }

  const saltRound = 10;
  const hashPassword = await bcrypt.hash(req.body.password, saltRound);

  const newUser = new authModel({
    name,
    email,
    password: hashPassword,
    phone_number: phoneNumber,
    profile_image: req.file.filename,
    status,
    role,
  });

  const user = await newUser.save();

  if (user) {
    logger.info(Messages.REGISTER_SUCCESS);
    next(
      new GeneralResponse(
        Messages.REGISTER_SUCCESS,
        StatusCodes.CREATED,
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
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authModel.findOne({ email });

  if (!user) {
    logger.error(`User ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `User ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (comparePassword) {
    let token = generateToken({
      email,
      password,
      role: user.role,
      id: user.id,
    });
    logger.info(Messages.LOGIN_SUCCESS);
    next(
      new GeneralError(
        Messages.LOGIN_SUCCESS,
        StatusCodes.OK,
        token,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  }
  logger.error(Messages.INCORRECT_CREDENTIAL);
  next(
    new GeneralError(
      Messages.INCORRECT_CREDENTIAL,
      StatusCodes.UNAUTHORIZED,
      undefined,
      RESPONSE_STATUS.ERROR,
    ),
  );
};

const updateProfile = async (req, res, next) => {
  const userEmail = req.user.email;
  const user = await authModel.findOne({ email: userEmail });

  if (user) {
    const { name, email, phoneNumber, status, role } = req.body;
    const updateData = {
      name,
      email,
      phoneNumber,
      status,
      role,
    };

    if (req.file) {
      const profile_image = req.file.filename;
      if (profile_image) updateData.profile_image = profile_image;
    }

    if (!req.body && !req.file) {
      logger.error(Messages.NO_VALID_FIELDS);
      next(
        new GeneralError(
          Messages.NO_VALID_FIELDS,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }

    const updatedData = await authModel.updateOne(
      { email: userEmail },
      updateData,
    );

    if (updatedData) {
      logger.info(`User profile ${Messages.UPDATE_SUCCESS}`);
      next(
        new GeneralResponse(
          `User profile ${Messages.UPDATE_SUCCESS}`,
          StatusCodes.ACCEPTED,
          undefined,
          RESPONSE_STATUS.SUCCESS,
        ),
      );
    }
    logger.error(`${Messages.FAILED_TO} update profile`);
    next(
      new GeneralError(
        `${Messages.FAILED_TO} update profile`,
        StatusCodes.BAD_REQUEST,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  } else {
    logger.error(`User ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `User ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const viewProfile = async (req, res, next) => {
  const email = req.user.email;
  const user = await authModel.findOne({ email: email });

  if (user) {
    logger.info(`User ${Messages.GET_SUCCESS}`);
    next(
      new GeneralError(
        undefined,
        StatusCodes.OK,
        user,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  }
  logger.error(`User ${Messages.NOT_FOUND}`);
  next(
    new GeneralError(
      `User ${Messages.NOT_FOUND}`,
      StatusCodes.NOT_FOUND,
      undefined,
      RESPONSE_STATUS.ERROR,
    ),
  );
};

const resetPassword = async (req, res, next) => {
  const email = req.user.email;
  const user = await authModel.findOne({ email: email });
  const { oldPassword, newPassword } = req.body;

  if (!user) {
    logger.error(`User ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `User ${Messages.NOT_FOUND}`,
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
    logger.error(`User ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `User ${Messages.NOT_FOUND}`,
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

      logger.info(`Password ${Messages.UPDATE_SUCCESS}`);
      next(
        new GeneralResponse(
          `Password ${Messages.UPDATE_SUCCESS}`,
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
  registration,
  login,
  updateProfile,
  viewProfile,
  resetPassword,
  verifyEmail,
  updatePassword,
};