const { eventModel } = require('../models/event');
const { eventImageModel } = require('../models/eventImage');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { GeneralResponse } = require('../utils/response');
const { Messages } = require('../utils/messages');
const { GeneralError } = require('../utils/error');
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
    new GeneralResponse(
      `Event ${Messages.ADD_SUCCESS}`,
      StatusCodes.OK,
      undefined,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

const addImage = async (req, res, next) => {
  const newImage = new eventImageModel({
    event_manage_id: req.body.event_manage_id,
    event_image: req.file.filename,
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

  const findEvent = await eventModel.findById(eventId);

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
  const query = eventModel.find(condition);

  if (pageSize) {
    query.limit(parseInt(pageSize));
  }

  const eventList = await query.exec();

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
  }
  logger.error(`Event ${Messages.NOT_FOUND}`);
  next(
    new GeneralResponse(
      `Event ${Messages.NOT_FOUND}`,
      StatusCodes.NOT_FOUND,
      undefined,
      RESPONSE_STATUS.ERROR,
    ),
  );
};

module.exports = { addEvent, addImage, updateEvent, listOfEvent, deleteEvent };