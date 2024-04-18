const { eventModel } = require('../models/event');
const { bookingModel } = require('../models/booking');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { Messages } = require('../utils/messages');
const { GeneralError } = require('../utils/error');
const { bookingFilter, eventFilter } = require('../helper/filter');
const logger = require('../logger/logger');

const eventReport = async (req, res, next) => {
  const { eventName, startDate, endDate, userName } = req.body;
  const filterData = await eventFilter(eventName, startDate, endDate, userName);

  const eventReport = await eventModel.aggregate([
    { $addFields: { _id: { $toString: '$_id' } } },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: 'event_manage_id',
        as: 'service_info',
      },
    },
    { $unwind: '$service_info' },
    { $addFields: { user_id: { $toObjectId: '$user_id' } } },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user_info',
      },
    },
    { $unwind: '$user_info' },
    {
      $match: {
        is_deleted: false,
        ...filterData,
      },
    },
    {
      $project: {
        _id: 1,
        event_name: 1,
        'service_info.service_name': 1,
        'user_info.name': 1,
      },
    },
  ]);

  if (eventReport && eventReport.length > 0) {
    logger.info(`Event ${Messages.GET_SUCCESS}`);
    next(
      new GeneralError(
        undefined,
        StatusCodes.OK,
        eventReport,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.info(`Event data ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Event data ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const bookingReport = async (req, res, next) => {
  const { eventName, startDate, endDate, userName } = req.body;
  const filterData = await bookingFilter(
    eventName,
    startDate,
    endDate,
    userName,
  );

  const bookingReport = await bookingModel.aggregate([
    { $addFields: { event_manage_id: { $toObjectId: '$event_manage_id' } } },
    {
      $lookup: {
        from: 'events',
        localField: 'event_manage_id',
        foreignField: '_id',
        as: 'event_info',
      },
    },
    {
      $unwind: '$event_info',
    },
    { $addFields: { user_id: { $toObjectId: '$user_id' } } },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user_info',
      },
    },
    {
      $unwind: '$user_info',
    },
    {
      $match: {
        is_deleted: false,
        ...filterData,
      },
    },
    {
      $project: {
        _id: 0,
        event_date: 1,
        status: 1,
        additional_information: 1,
        'event_info.event_name': 1,
        'user_info.name': 1,
      },
    },
  ]);
  if (bookingReport) {
    logger.info(`Booking data ${Messages.GET_SUCCESS}`);
    next(
      new GeneralError(
        undefined,
        StatusCodes.OK,
        bookingReport,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Booking data ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Booking data ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

module.exports = {
  eventReport,
  bookingReport,
};