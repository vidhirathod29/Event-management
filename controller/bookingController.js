const { bookingModel } = require('../models/booking');
const { RESPONSE_STATUS } = require('../utils/enum');
const { Messages } = require('../utils/messages');
const { GeneralResponse } = require('../utils/response');
const { GeneralError } = require('../utils/error');
const logger = require('../logger/logger');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');

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

  const findBooking = await bookingModel.findOne(bookingId, {
    is_deleted: false,
  });
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
  if (condition) {
    condition._id = new mongoose.Types.ObjectId(condition._id);
  }
  const pipeline = [
    { $match: { ...condition, is_deleted: false } },
    {
      $set: {
        user_id: { $toObjectId: '$user_id' },
        event_manage_id: { $toObjectId: '$event_manage_id' },
        address_id: { $toObjectId: '$address_id' },
        country_id: { $toObjectId: '$country_id' },
        state_id: { $toObjectId: '$state_id' },
        city_id: { $toObjectId: '$city_id' },
      },
    },
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
    { $addFields: { _id: { $toString: '$_id' } } },
    {
      $lookup: {
        from: 'event_images',
        localField: '_id',
        foreignField: 'event_manage_id',
        as: 'event_image',
      },
    },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: 'event_manage_id',
        as: 'service_info',
      },
    },
    {
      $lookup: {
        from: 'addresses',
        localField: 'address_id',
        foreignField: '_id',
        as: 'address_info',
      },
    },
    {
      $unwind: '$address_info',
    },
    { $addFields: { country_id: { $toObjectId: '$address_info.country_id' } } },
    {
      $lookup: {
        from: 'countries',
        localField: 'country_id',
        foreignField: '_id',
        as: 'country_info',
      },
    },
    {
      $unwind: '$country_info',
    },
    { $addFields: { state_id: { $toObjectId: '$address_info.state_id' } } },
    {
      $lookup: {
        from: 'states',
        localField: 'state_id',
        foreignField: '_id',
        as: 'state_info',
      },
    },
    {
      $unwind: '$state_info',
    },
    { $addFields: { city_id: { $toObjectId: '$address_info.city_id' } } },
    {
      $lookup: {
        from: 'cities',
        localField: 'city_id',
        foreignField: '_id',
        as: 'city_info',
      },
    },
    {
      $unwind: '$city_info',
    },
    {
      $project: {
        event_date: 1,
        additional_information: 1,
        status: 1,
        user_info: {
          _id: '$user_info._id',
          name: '$user_info.name',
        },
        event_info: {
          _id: '$event_info._id',
          event_name: '$event_info.event_name',
          event_description: '$event_info.event_description',
        },
        event_image: {
          _id: '$event_image._id',
          event_image: '$event_image.event_image',
        },
        service_info: {
          _id: '$service_info._id',
          service_name: '$service_info.service_name',
          price: '$service_info.price',
          service_description: '$service_info.service_description',
        },
        address_info: {
          _id: '$address_info._id',
          address_line1: '$address_info.address_line1',
          address_line2: '$address_info.address_line2',
          zip_code: '$address_info.zip_code',
        },
        country_info: {
          _id: '$country_info._id',
          name: '$country_info.country_name',
        },
        state_info: {
          _id: '$state_info._id',
          name: '$state_info.state_name',
        },
        city_info: {
          _id: '$city_info._id',
          name: '$city_info.city_name',
        },
      },
    },
  ];

  if (pageSize) {
    pipeline.push({ $limit: parseInt(pageSize) });
  }
  const bookingList = await bookingModel.aggregate(pipeline);

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

  const findBooking = await bookingModel.findById(bookingId, {
    is_deleted: false,
  });

  if (findBooking) {
    const deleteBooking = await bookingModel.findByIdAndUpdate(bookingId, {
      is_deleted: true,
    });

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