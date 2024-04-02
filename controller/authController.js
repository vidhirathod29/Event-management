const { authModel } = require('../models/auth');
const { otpModel } = require('../models/otp');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { GeneralResponse } = require('../utils/response');
const { Messages } = require('../utils/messages');
const { GeneralError } = require('../utils/error');
const { generateToken } = require('../middleware/authentication');
const { sendOtp } = require('../middleware/mail');
const bcrypt = require('bcrypt');
const moment = require('moment');
const logger = require('../logger/logger');

const registration = async (req, res, next) => {
  const encrypt = await bcrypt.hash(req.body.password, 10);
  const { name, email, phone_number, status, role } = req.body;
  const existingUser = await authModel.findOne({ email: req.body.email });
  if (existingUser) {
    next(
      new GeneralError(
        `User ${Messages.ALREADY_EXIST}`,
        undefined,
        StatusCodes.CONFLICT,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
  if (!req.file) {
    next(
      new GeneralError(
        Messages.IMAGE_NOT_FOUND,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
  const newUser = new authModel({
    name,
    email,
    password: encrypt,
    phone_number,
    profile_image: req.file.filename,
    status,
    role,
  });
  const user = await newUser.save();
  if (user) {
    next(
      new GeneralResponse(
        Messages.REGISTER_SUCCESS,
        undefined,
        StatusCodes.CREATED,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    next(
      new GeneralError(
        Messages.SOMETHING_WENT_WRONG,
        StatusCodes.BAD_REQUEST,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authModel.findOne({ email: email });
  if (!user) {
    next(
      new GeneralError(
        Messages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (comparePassword) {
    let token = generateToken({ email, password });
    next(
      new GeneralError(
        Messages.LOGIN_SUCCESS,
        StatusCodes.OK,
        token,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    next(
      new GeneralError(
        Messages.INCORRECT_CREDENTIAL,
        StatusCodes.UNAUTHORIZED,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const updateProfile = async (req, res, next) => {
  const userEmail = req.user.email;
  const user = await authModel.findOne({ email: userEmail });
  if (user) {
    const { name, email, phone_number, status, role } = req.body;
    const updateData = {
      name,
      email,
      phone_number,
      status,
      role,
    };
    if (req.file) {
      const profile_image = req.file.filename;
      if (profile_image) updateData.profile_image = profile_image;
    }
    if (!req.body && !req.file) {
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
      next(
        new GeneralResponse(
          Messages.UPDATE_DATA_SUCCESS,
          StatusCodes.OK,
          undefined,
          RESPONSE_STATUS.SUCCESS,
        ),
      );
    } else {
      next(
        new GeneralError(
          Messages.UPDATE_DATA_FAIL,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
  } else {
    next(
      new GeneralError(
        Messages.USER_NOT_FOUND,
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
    next(
      new GeneralError(
        Messages.GET_SUCCESS,
        StatusCodes.OK,
        user,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    next(
      new GeneralError(
        Messages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const resetPassword = async (req, res, next) => {
  const email = req.user.email;
  const user = await authModel.findOne({ email: email });
  const { oldPassword, newPassword } = req.body;

  if (user) {
    const comparePassword = await bcrypt.compare(oldPassword, user.password);

    if (comparePassword) {
      const generatedPassword = await bcrypt.hash(newPassword, 10);
      const resetPassword = await authModel.updateOne(
        { email },
        { password: generatedPassword },
      );

      if (resetPassword) {
        next(
          new GeneralResponse(
            Messages.RESET_PASS_SUCCESS,
            StatusCodes.NO_CONTENT,
            undefined,
            RESPONSE_STATUS.SUCCESS,
          ),
        );
      } else {
        next(
          new GeneralError(
            Messages.SOMETHING_WENT_WRONG,
            StatusCodes.BAD_REQUEST,
            undefined,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }

    } else {
      next(
        new GeneralError(
          Messages.INVALID_OLD_PASS,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }

  } else {
    next(
      new GeneralError(
        Messages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const verifyEmail = async (req, res, next) => {
  const email = req.body.email;
  const user = await authModel.findOne({ email: email });

  if (user) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expireTime = moment().add(2, 'minute').format();
    const generatedOtp = new otpModel({
      email: email,
      otp: otp,
      expireTime: expireTime.toString(),
    });

    const newOtp = await generatedOtp.save();
    sendOtp(email, otp);

    if (newOtp) {
      next(
        new GeneralError(
          Messages.OTP_SENT_SUCCESS,
          StatusCodes.OK,
          otp,
          RESPONSE_STATUS.SUCCESS,
        ),
      );
    } else {
      next(
        new GeneralError(
          Messages.OTP_GENERATE_FAIL,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
  
  } else {
    next(
      new GeneralError(
        Messages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
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
      const deleteOtp = await otpModel.deleteOne({ otp });
      logger.log('Deleted Otp', deleteOtp);
      next(
        new GeneralResponse(
          Messages.PASS_UPDATE_SUCCESS,
          StatusCodes.OK,
          undefined,
          RESPONSE_STATUS.SUCCESS,
        ),
      );
    } else {
      next(
        new GeneralError(
          Messages.SOMETHING_WENT_WRONG,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }

  } else {
    next(
      new GeneralError(
        Messages.INVALID_OTP,
        StatusCodes.BAD_REQUEST,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
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