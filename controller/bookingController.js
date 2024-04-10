const { bookingModel } = require('../models/booking');
const { RESPONSE_STATUS } = require('../utils/enum');
const { Messages } = require('../utils/messages');
const { GeneralResponse } = require('../utils/response');
const { GeneralError } = require('../utils/error');
const logger = require('../logger/logger');
const { StatusCodes } = require('http-status-codes');

const addBooking = async (req, res, next) => {
  const userId = req.user.id;

  const {
    address_id,
    event_manage_id,
    event_date,
    additional_information,
    status,
  } = req.body;

  const newBooking = new bookingModel({
    user_id: userId,
    address_id,
    event_manage_id,
    event_date,
    additional_information,
    status,
  });

  const addBooking = await newBooking.save();

  logger.info(`Booking ${Messages.ADD_SUCCESS}`);
  next(
    new GeneralError(
      `Booking ${Messages.ADD_SUCCESS}`,
      StatusCodes.OK,
      addBooking.id,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

const updateBooking = async (req, res, next) => {
  const bookingId = req.params.id;

  const findBooking = await bookingModel.findById(bookingId);
  if (findBooking) {
    const { event_date, additional_information, status } = req.body;

    const updateBooking = {
      event_date,
      additional_information,
      status,
    };

    const updatedBookingData = await bookingModel.findByIdAndUpdate(
      bookingId,
      updateBooking,
    );

    if (!updatedBookingData) {
      logger.error(`${Messages.FAILED_TO} update event booking`);
      next(
        new GeneralError(
          `${Messages.FAILED_TO} update event booking`,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
    logger.info(`Event booking ${Messages.UPDATE_SUCCESS}`);
    next(
      new GeneralResponse(
        `Event booking ${Messages.UPDATE_SUCCESS}`,
        StatusCodes.ACCEPTED,
        undefined,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Event booking ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Event booking ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const listOfBooking = async (req, res, next) => {
  const { condition, pageSize } = req.body;
  const query = bookingModel.find(condition);

  if (pageSize) {
    query.limit(parseInt(pageSize));
  }

  const bookingList = await query.exec();

  if (bookingList.length > 0) {
    logger.info(`Event booking ${Messages.GET_SUCCESS}`);
    next(
      new GeneralError(
        undefined,
        StatusCodes.OK,
        bookingList,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Event booking ${Messages.NOT_FOUND}`);
    next(
      new GeneralResponse(
        `Event booking ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const deleteBooking = async (req, res, next) => {
  const bookingId = req.params.id;

  const findBooking = await bookingModel.findById(bookingId);

  if (findBooking) {
    const deleteBooking = await bookingModel.findByIdAndDelete(bookingId);

    if (!deleteBooking) {
      logger.error(`${Messages.FAILED_TO} delete event booking`);
      next(
        new GeneralError(
          `${Messages.FAILED_TO} delete event booking`,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
    logger.info(`Event booking ${Messages.DELETE_SUCCESS}`);
    next(
      new GeneralResponse(
        `Event booking ${Messages.DELETE_SUCCESS}`,
        StatusCodes.OK,
        undefined,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Event booking ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Event booking ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

module.exports = {
  addBooking,
  updateBooking,
  listOfBooking,
  deleteBooking,
};