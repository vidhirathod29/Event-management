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

  const service = await newService.save();

  if (service) {
    logger.info(`Event service ${Messages.ADD_SUCCESS}`);
    next(
      new GeneralResponse(
        `Event service ${Messages.ADD_SUCCESS}`,
        StatusCodes.OK,
        undefined,
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
  const findService = await serviceModel.findById(serviceId);

  if (findService) {
    const { service_name, price, service_description } = req.body;
    const updateService = { service_name, price, service_description };

    const updatedService = await serviceModel.findByIdAndUpdate(
      serviceId,
      updateService,
    );

    if (!updatedService) {
      logger.error(`${Messages.FAILED_TO_UPDATE} event service`);
      next(
        new GeneralError(
          `${Messages.FAILED_TO_UPDATE} event service`,
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
  const service = await serviceModel.findById(serviceId);

  if (service) {
    const deleteEvent = await serviceModel.findByIdAndDelete(serviceId);

    if (!deleteEvent) {
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
  const query = serviceModel.find(condition);

  if (pageSize) {
    query.limit(parseInt(pageSize));
  }

  const serviceList = await query.exec();

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