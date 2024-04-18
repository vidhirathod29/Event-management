const { bookingModel } = require('../models/booking');
const { authModel } = require('../models/auth');
const { eventModel } = require('../models/event');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { Messages } = require('../utils/messages');
const { GeneralError } = require('../utils/error');
const logger = require('../logger/logger');

const listOfLatestEvent = async (req, res, next) => {
  const listOfEvent = await eventModel.aggregate([
    {
      $match: {
        is_deleted: false,
      },
    },
    {
      $set: {
        user_id: { $toObjectId: '$user_id' },
        event_manage_id: { $toObjectId: '$event_manage_id' },
      },
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
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $sort: { created_at: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        event_name: 1,
        event_description: 1,
        event_image: {
          _id: '$event_image._id',
          event_image: '$event_image.event_image',
        },
        user: {
          _id: '$user._id',
          name: '$user.name',
          email: '$user.email',
        },
      },
    },
  ]);

  logger.info(`Latest list of events ${Messages.GET_SUCCESS}`);
  next(
    new GeneralError(
      undefined,
      StatusCodes.OK,
      listOfEvent,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

const listOfLatestBooking = async (req, res, next) => {
  const listOfBooking = await bookingModel.aggregate([
    {
      $match: {
        is_deleted: false,
      },
    },
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
      $sort: { created_at: -1 },
    },
    {
      $limit: 5,
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
  ]);

  logger.info(`Latest list of bookings ${Messages.GET_SUCCESS}`);
  next(
    new GeneralError(
      undefined,
      StatusCodes.OK,
      listOfBooking,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

const countOfBookingStatus = async (req, res, next) => {
  const countOfStatus = await bookingModel.aggregate([
    {
      $match: {
        is_deleted: false,
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: 1 },
    },
  ]);
  
  const totalCountOfStatus = countOfStatus.reduce((status, data) => {
    status[data._id] = data.count;
    return status;
  }, {});

  logger.info(`Count of Booking Status ${Messages.GET_SUCCESS}`);
  next(
    new GeneralError(
      undefined,
      StatusCodes.OK,
      totalCountOfStatus,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

const countOfTotalUser = async (req, res, next) => {
  const countOfUser = await authModel.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: 1 },
    },
    { $unwind: '$_id' },
  ]);

  const totalCountOfUser = countOfUser.reduce((user, data) => {
    user[data._id] = data.count;
    return user;
  }, {});

  logger.info(`Count of Total User ${Messages.GET_SUCCESS}`);
  next(
    new GeneralError(
      undefined,
      StatusCodes.OK,
      totalCountOfUser,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

const countOfTotalEvent = async (req, res, next) => {
  const countOfEvent = await eventModel.aggregate([
    {
      $match: {
        is_deleted: false,
      },
    },
    {
      $group: {
        _id: '$event_name',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    { $unwind: '$_id' },
  ]);

  const totalCountOfEvent = countOfEvent.reduce((event, data) => {
    event[data._id] = data.count;
    return event;
  }, {});

  logger.info(`Count of Total Event ${Messages.GET_SUCCESS}`);
  next(
    new GeneralError(
      undefined,
      StatusCodes.OK,
      totalCountOfEvent,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

const graphOfUser = async (req, res, next) => {
  const { type } = req.body;
  const currentDate = new Date();

  let pipeline = [];
  let dateRange;

  if (type == 'weekly') {
    const today = currentDate.getDay();
    const weekStart = new Date(currentDate);
    const sevenDayPrevious = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - (today - 1));
    sevenDayPrevious.setDate(currentDate.getDate() - 7); 
    dateRange = { $gte: sevenDayPrevious, $lte: weekStart };
    pipeline.push(
      {
        $match: { created_at: dateRange },
      },
      {
        $group: {
          _id: {
            date: { $dayOfMonth: '$created_at' },
            month: { $month: '$created_at' },
            year: { $year: '$created_at' },
          },
          countOfTotalUser: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          month: '$_id.month',
          year: '$_id.year',
          countOfTotalUser: 1,
        },
      },
    );
  }  else if (type == 'monthly') {
    pipeline.push(
      {
        $group: {
          _id: {
            month: { $month: '$created_at' },
            year: { $year: '$created_at' },
          },
          countOfTotalUser: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          countOfTotalUser: 1,
        },
      },
    );
  } else if (type == 'yearly') {
    pipeline.push(
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
          },
          countOfTotalUser: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          countOfTotalUser: 1,
        },
      },
    );
  } else {
    logger.error(`Type ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Type ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }

  const graphOfUser = await authModel.aggregate(pipeline);
  logger.info(`Graph of user ${Messages.GET_SUCCESS}`);
  next(
    new GeneralError(
      undefined,
      StatusCodes.OK,
      graphOfUser,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

module.exports = {
  listOfLatestEvent,
  listOfLatestBooking,
  countOfBookingStatus,
  countOfTotalUser,
  countOfTotalEvent,
  graphOfUser,
};