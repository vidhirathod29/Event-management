const { eventModel } = require('../models/event');
const { eventImageModel } = require('../models/eventImage');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { GeneralResponse } = require('../utils/response');
const { Messages } = require('../utils/messages');
const { GeneralError } = require('../utils/error');
const mongoose = require('mongoose');
const logger = require('../logger/logger');

const addEvent = async (req, res, next) => {
  const userId = req.user.id;
  const { event_name, event_description } = req.body;

  const newEvent = new eventModel({
    user_id: userId,
    event_name,
    event_description,
  });

  const addedEvent = await newEvent.save();

  if (!addedEvent) {
    logger.error(Messages.SOMETHING_WENT_WRONG);
    next(
      new GeneralError(
        Messages.SOMETHING_WENT_WRONG,
        StatusCodes.SOMETHING_WENT_WRONG,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
  logger.info(`Event ${Messages.ADD_SUCCESS}`);
  next(
    new GeneralError(
      `Event ${Messages.ADD_SUCCESS}`,
      StatusCodes.OK,
      addedEvent.id,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

const addImage = async (req, res, next) => {
  const newImage = new eventImageModel({
    event_manage_id: req.body.event_manage_id,
    event_image: req.file,
  });

  await newImage.save();
  logger.info(`Event image ${Messages.ADD_SUCCESS}`);
  next(
    new GeneralResponse(
      `Event image ${Messages.ADD_SUCCESS}`,
      StatusCodes.OK,
      undefined,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

const updateEvent = async (req, res, next) => {
  const eventId = req.params.id;

  const findEvent = await eventModel.findOne({
    _id: eventId,
    is_deleted: false,
  });

  if (findEvent) {
    const { event_name, event_description } = req.body;
    const updateEvent = { event_name, event_description };

    const updatedEvent = await eventModel.findByIdAndUpdate(
      eventId,
      updateEvent,
    );

    if (!updatedEvent) {
      logger.error(`${Messages.FAILED_TO} update event`);
      next(
        new GeneralError(
          `${Messages.FAILED_TO} update event`,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
    logger.info(`Event ${Messages.UPDATE_SUCCESS}`);
    next(
      new GeneralResponse(
        `Event ${Messages.UPDATE_SUCCESS}`,
        StatusCodes.ACCEPTED,
        undefined,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Event ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Event ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const deleteEvent = async (req, res, next) => {
  const eventId = req.params.id;

  const findEvent = await eventModel.findById(eventId);

  if (findEvent) {
    const deleteEvent = await eventModel.findByIdAndUpdate(eventId, {
      is_deleted: true,
    });

    if (!deleteEvent) {
      logger.error(`${Messages.FAILED_TO} delete event`);
      next(
        new GeneralError(
          `${Messages.FAILED_TO} delete event`,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
    logger.info(`Event ${Messages.DELETE_SUCCESS}`);
    next(
      new GeneralResponse(
        `Event ${Messages.DELETE_SUCCESS}`,
        StatusCodes.OK,
        undefined,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Event ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Event ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const listOfEvent = async (req, res, next) => {
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
      $project: {
        event_name: 1,
        event_description: 1,
        event_image: {
          _id: '$event_image._id',
          event_image: '$event_image.event_image',
        },
        user_info: {
          _id: '$user_info._id',
          name: '$user_info.name',
          email: '$user_info.email',
        },
        service_info: {
          _id: '$service_info._id',
          service_name: '$service_info.service_name',
          price: '$service_info.price',
          service_description: '$service_info.service_description',
        },
      },
    },
  ];

  if (pageSize) {
    pipeline.push({ $limit: parseInt(pageSize) });
  }

  const eventList = await eventModel.aggregate(pipeline);

  if (eventList.length > 0) {
    logger.info(`Event ${Messages.GET_SUCCESS}`);
    next(
      new GeneralError(
        undefined,
        StatusCodes.OK,
        eventList,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Event ${Messages.NOT_FOUND}`);
    next(
      new GeneralResponse(
        `Event ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

module.exports = { addEvent, addImage, updateEvent, listOfEvent, deleteEvent };