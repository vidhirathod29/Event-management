const express = require('express');
const router = express.Router();
const {
  listOfLatestEvent,
  listOfLatestBooking,
  countOfBookingStatus,
  countOfTotalUser,
  countOfTotalEvent,
  graphOfUser,
} = require('../controller/dashBoardController');
const { errorHandler } = require('../helper/error');
const { authorization } = require('../middleware/authentication');
const { ROLES } = require('../utils/enum');

router.get(
  '/listOfLatestEvent',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  errorHandler(listOfLatestEvent),
);

router.get(
  '/listOfLatestBooking',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  errorHandler(listOfLatestBooking),
);

router.get(
  '/countOfBookingStatus',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  errorHandler(countOfBookingStatus),
);

router.get(
  '/countOfTotalUser',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  errorHandler(countOfTotalUser),
);

router.get(
  '/countOfTotalEvent',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION, ROLES.USER]),
  errorHandler(countOfTotalEvent),
);

router.post(
  '/graphOfUser',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  errorHandler(graphOfUser),
);
module.exports = router;
