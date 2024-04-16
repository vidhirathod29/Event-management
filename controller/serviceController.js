const { serviceModel } = require('../models/service');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { GeneralResponse } = require('../utils/response');
const { Messages } = require('../utils/messages');
const { GeneralError } = require('../utils/error');
const logger = require('../logger/logger');
const mongoose = require('mongoose');

const addService = async (req, res, next) => {
  const userId = req.user.id;
  const { event_manage_id, service_name, price, service_description } =
    req.body;

  const newService = new serviceModel({
    user_id: userId,
    event_manage_id,
    service_name,
    price,
    service_description,
  });

  const addedService = await newService.save();

  logger.info(`Event service ${Messages.ADD_SUCCESS}`);
  next(
    new GeneralResponse(
      `Event service ${Messages.ADD_SUCCESS}`,
      StatusCodes.OK,
      addedService.id,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

const updateService = async (req, res, next) => {
  const serviceId = req.params.id;
  const findService = await serviceModel.findOne({
    _id: serviceId,
    is_deleted: false,
  });

  if (findService) {
    const { service_name, price, service_description } = req.body;
    const updateService = { service_name, price, service_description };

    const updatedService = await serviceModel.findByIdAndUpdate(
      serviceId,
      updateService,
    );

    if (!updatedService) {
      logger.error(`${Messages.FAILED_TO} update service`);
      next(
        new GeneralError(
          `${Messages.FAILED_TO} update service`,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }

    logger.info(`Event service ${Messages.UPDATE_SUCCESS}`);
    next(
      new GeneralResponse(
        ` Event service ${Messages.UPDATE_SUCCESS}`,
        StatusCodes.ACCEPTED,
        undefined,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Event service ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Event service ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const deleteService = async (req, res, next) => {
  const serviceId = req.params.id;
  const findService = await serviceModel.findById(serviceId, {
    is_deleted: false,
  });

  if (findService) {
    const deleteService = await serviceModel.findByIdAndUpdate(serviceId, {
      is_deleted: true,
    });

    if (!deleteService) {
      logger.error(`${Messages.FAILED_TO} delete event service`);
      next(
        new GeneralError(
          `${Messages.FAILED_TO} delete event service`,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
    logger.info(`Event service ${Messages.DELETE_SUCCESS}`);
    next(
      new GeneralResponse(
        `Event service ${Messages.DELETE_SUCCESS}`,
        StatusCodes.OK,
        undefined,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Event service ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Event service ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const listOfService = async (req, res, next) => {
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
      $project: {
        service_name: 1,
        price: 1,
        service_description: 1,
        user_info: {
          _id: '$user_info._id',
          name: '$user_info.name',
        },
        event_info: {
          _id: '$event_info._id',
          name: '$event_info.event_name',
        },
        event_image: {
          _id: '$event_image._id',
          event_image: '$event_image.event_image',
        },
      },
    },
  ];

  if (pageSize) {
    pipeline.push({ $limit: parseInt(pageSize) });
  }

  const serviceList = await serviceModel.aggregate(pipeline);

  if (serviceList.length > 0) {
    logger.info(`Event service ${Messages.GET_SUCCESS}`);
    next(
      new GeneralError(
        undefined,
        StatusCodes.OK,
        serviceList,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Event service ${Messages.NOT_FOUND}`);
    next(
      new GeneralResponse(
        `Event service ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

module.exports = {
  addService,
  updateService,
  deleteService,
  listOfService,
};
