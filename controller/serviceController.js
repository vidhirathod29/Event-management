const { serviceModel } = require('../models/service');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { GeneralResponse } = require('../utils/response');
const { Messages } = require('../utils/messages');
const { GeneralError } = require('../utils/error');
const logger = require('../logger/logger');

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

  if (addedService) {
    logger.info(`Event service ${Messages.ADD_SUCCESS}`);
    next(
      new GeneralResponse(
        `Event service ${Messages.ADD_SUCCESS}`,
        StatusCodes.OK,
        addedService.id,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
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
};

const updateService = async (req, res, next) => {
  const serviceId = req.params.id;
  const findService = await serviceModel.find(serviceId);

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

    logger.info(`Service ${Messages.UPDATE_SUCCESS}`);
    next(
      new GeneralResponse(
        ` Service ${Messages.UPDATE_SUCCESS}`,
        StatusCodes.ACCEPTED,
        undefined,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Service ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Service ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const deleteService = async (req, res, next) => {
  const serviceId = req.params.id;
  const findService = await serviceModel.findById(serviceId);

  if (findService) {
    const deleteEvent = await serviceModel.findByIdAndDelete(serviceId);

    if (!deleteEvent) {
      logger.error(`${Messages.FAILED_TO} delete service`);
      next(
        new GeneralError(
          `${Messages.FAILED_TO} delete service`,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
    logger.info(`Service ${Messages.DELETE_SUCCESS}`);
    next(
      new GeneralResponse(
        `Service ${Messages.DELETE_SUCCESS}`,
        StatusCodes.OK,
        undefined,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Service ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Service ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const listOfService = async (req, res, next) => {
  const { condition, pageSize } = req.body;
  const pipeline = [
    { $match: { condition } },

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
      $lookup: {
        from: 'events',
        localField: 'event_manage_id',
        foreignField: '_id',
        as: 'event_info',
      },
    },

    {
      $unwind: '$user_info',
    },

    {
      $unwind: '$event_info',
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
      },
    },
  ];

  if (pageSize) {
    pipeline.push({ $limit: parseInt(pageSize) });
  }

  const serviceList = await serviceModel.aggregate(pipeline);

  if (serviceList.length > 0) {
    logger.info(`Service ${Messages.GET_SUCCESS}`);
    next(
      new GeneralError(
        undefined,
        StatusCodes.OK,
        serviceList,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Service ${Messages.NOT_FOUND}`);
    next(
      new GeneralResponse(
        `Service ${Messages.NOT_FOUND}`,
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