const { countryModel } = require('../models/country');
const { stateModel } = require('../models/state');
const { cityModel } = require('../models/city');
const { addressModel } = require('../models/address');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { Messages } = require('../utils/messages');
const { GeneralError } = require('../utils/error');
const { GeneralResponse } = require('../utils/response');
const mongoose = require('mongoose');
const logger = require('../logger/logger');

const listOfCountry = async (req, res, next) => {
  const country = await countryModel.find({}, { _id: 1, country_name: 1 });

  if (country.length > 0) {
    logger.info(`Country ${Messages.GET_SUCCESS}`);
    next(
      new GeneralError(
        undefined,
        StatusCodes.OK,
        country,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  }
  logger.error(Messages.SOMETHING_WENT_WRONG);
  next(
    new GeneralError(
      Messages.SOMETHING_WENT_WRONG,
      StatusCodes.SOMETHING_WENT_WRONG,
      undefined,
      RESPONSE_STATUS.ERROR,
    ),
  );
};

const listOfState = async (req, res, next) => {
  const stateData = await stateModel.aggregate([
    {
      $lookup: {
        from: 'countries',
        localField: 'country_id',
        foreignField: '_id',
        as: 'countryDetails',
      },
    },
    {
      $unwind: '$countryDetails',
    },
    {
      $project: {
        _id: 1,
        state_name: 1,
        countryDetail: {
          _id: '$countryDetails._id',
          country_name: '$countryDetails.country_name',
        },
      },
    },
  ]);

  if (stateData) {
    logger.info(`State ${Messages.GET_SUCCESS}`);
    next(
      new GeneralError(
        undefined,
        StatusCodes.OK,
        stateData,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  }
  logger.error(Messages.SOMETHING_WENT_WRONG);
  next(
    new GeneralError(
      Messages.SOMETHING_WENT_WRONG,
      StatusCodes.BAD_REQUEST,
      undefined,
      RESPONSE_STATUS.ERROR,
    ),
  );
};

const listOfCity = async (req, res, next) => {
  const cityData = await cityModel.aggregate([
    {
      $lookup: {
        from: 'states',
        localField: 'state_id',
        foreignField: '_id',
        as: 'stateDetails',
      },
    },
    {
      $unwind: '$stateDetails',
    },
    {
      $project: {
        _id: 1,
        city_name: 1,
        stateDetails: {
          _id: '$stateDetails._id',
          country_name: '$stateDetails.state_name',
        },
      },
    },
  ]);

  if (cityData) {
    logger.info(`City ${Messages.GET_SUCCESS}`);
    next(
      new GeneralError(
        undefined,
        StatusCodes.OK,
        cityData,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  }
  logger.error(Messages.SOMETHING_WENT_WRONG);
  next(
    new GeneralError(
      Messages.SOMETHING_WENT_WRONG,
      StatusCodes.BAD_REQUEST,
      undefined,
      RESPONSE_STATUS.ERROR,
    ),
  );
};

const addAddress = async (req, res, next) => {
  const userId = req.user.id;

  const {
    country_id,
    state_id,
    city_id,
    address_line1,
    address_line2,
    zip_code,
  } = req.body;

  const newAddress = new addressModel({
    user_id: userId,
    country_id,
    state_id,
    city_id,
    address_line1,
    address_line2,
    zip_code,
  });

  const addAddress = await newAddress.save();

  logger.info(`Address ${Messages.ADD_SUCCESS}`);
  next(
    new GeneralError(
      `Address ${Messages.ADD_SUCCESS}`,
      StatusCodes.OK,
      addAddress.id,
      RESPONSE_STATUS.SUCCESS,
    ),
  );
};

const updateAddress = async (req, res, next) => {
  const addressId = req.params.id;

  const findAddress = await addressModel.findOne(addressId, {
    is_deleted: false,
  });

  if (findAddress) {
    const {
      country_id,
      state_id,
      city_id,
      address_line1,
      address_line2,
      zip_code,
    } = req.body;

    const updateAddress = {
      country_id,
      state_id,
      city_id,
      address_line1,
      address_line2,
      zip_code,
    };

    const updatedAddress = await addressModel.findByIdAndUpdate(
      addressId,
      updateAddress,
    );

    if (!updatedAddress) {
      logger.error(`${Messages.FAILED_TO} update address`);
      next(
        new GeneralError(
          `${Messages.FAILED_TO} update address`,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
    logger.info(`Address ${Messages.UPDATE_SUCCESS}`);
    next(
      new GeneralResponse(
        ` Address ${Messages.UPDATE_SUCCESS}`,
        StatusCodes.ACCEPTED,
        undefined,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Address ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Address ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const deleteAddress = async (req, res, next) => {
  const addressId = req.params.id;

  const findAddress = await addressModel.findById(addressId, {
    is_deleted: false,
  });

  if (findAddress) {
    const deleteAddress = await addressModel.findByIdAndUpdate(addressId, {
      is_deleted: true,
    });
    if (!deleteAddress) {
      logger.error(`${Messages.FAILED_TO} delete address`);
      next(
        new GeneralError(
          `${Messages.FAILED_TO} delete address`,
          StatusCodes.BAD_REQUEST,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
    logger.info(`Address ${Messages.DELETE_SUCCESS}`);
    next(
      new GeneralResponse(
        `Address ${Messages.DELETE_SUCCESS}`,
        StatusCodes.OK,
        undefined,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Address ${Messages.NOT_FOUND}`);
    next(
      new GeneralError(
        `Address ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

const listOfAddress = async (req, res, next) => {
  const { condition, pageSize } = req.body;
  if (condition) {
    condition._id = new mongoose.Types.ObjectId(condition._id);
  }
  const pipeline = [
    { $match: { ...condition, is_deleted: false } },
    {
      $set: {
        user_id: { $toObjectId: '$user_id' },
        country_id: { $toObjectId: '$country_id' },
        state_id: { $toObjectId: '$state_id' },
        city_id: { $toObjectId: '$city_id' },
      },
    },
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
      $project: {
        address_line1: 1,
        address_line2: 1,
        zip_code: 1,
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
        user_info: {
          _id: '$user_info._id',
          name: '$user_info.name',
        },
      },
    },
  ];

  if (pageSize) {
    pipeline.push({ $limit: parseInt(pageSize) });
  }

  const addressList = await addressModel.aggregate(pipeline);

  if (addressList.length > 0) {
    logger.info(`Address ${Messages.GET_SUCCESS}`);
    next(
      new GeneralError(
        undefined,
        StatusCodes.OK,
        addressList,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    logger.error(`Address ${Messages.NOT_FOUND}`);
    next(
      new GeneralResponse(
        `Address ${Messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

module.exports = {
  listOfCountry,
  listOfState,
  listOfCity,
  addAddress,
  updateAddress,
  deleteAddress,
  listOfAddress,
};
