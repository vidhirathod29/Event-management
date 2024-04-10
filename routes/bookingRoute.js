const express = require('express');
const router = express.Router();
const {
  addBooking,
  updateBooking,
  listOfBooking,
  deleteBooking,
} = require('../controller/bookingController');
const { errorHandler } = require('../helper/error');
const { validator } = require('../validation/validator');
const validate = require('../validation/bookingValidation');
const { authorization } = require('../middleware/authentication');
const { ROLES } = require('../utils/enum');

router.post(
  '/addBooking',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  validator.body(validate.addBooking),
  errorHandler(addBooking),
);

router.put(
  '/editBooking/:id',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  validator.body(validate.updateBooking),
  errorHandler(updateBooking),
);

router.post(
  '/listOfBooking',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION, ROLES.USER]),
  validator.body(validate.listOfBooking),
  errorHandler(listOfBooking),
);

router.delete(
  '/deleteBooking/:id',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  errorHandler(deleteBooking),
);

module.exports = router;