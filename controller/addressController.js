const { countryModel } = require('../models/country');
const { stateModel } = require('../models/state');
const { cityModel } = require('../models/city');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { Messages } = require('../utils/messages');
const { GeneralError } = require('../utils/error');

const listOfCountry = async (req, res, next) => {
  const country = await countryModel.find({});

  if (country.length > 0) {
    next(
      new GeneralError(
        Messages.COUNTRY_GET_SUCCESS,
        StatusCodes.OK,
        country,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
    next(
      new GeneralError(
        Messages.SOMETHING_WENT_WRONG,
        StatusCodes.SOMETHING_WENT_WRONG,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
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
        countryDetail: '$countryDetails.country_name',
      },
    },
  ]);

  if (stateData) {
    next(
      new GeneralError(
        Messages.STATE_GET_SUCCESS,
        StatusCodes.OK,
        stateData,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
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
        stateDetail: '$stateDetails.state_name',
      },
    },
  ]);

  if (cityData) {
    next(
      new GeneralError(
        Messages.CITY_GET_SUCCESS,
        StatusCodes.OK,
        cityData,
        RESPONSE_STATUS.SUCCESS,
      ),
    );
  } else {
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

module.exports = {
  listOfCountry,
  listOfState,
  listOfCity
};