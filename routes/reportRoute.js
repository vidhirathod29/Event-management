const express = require('express');
const router = express.Router();
const {
  eventReport,
  bookingReport,
} = require('../controller/reportController');
const { errorHandler } = require('../helper/error');
const { validator } = require('../validation/validator');
const { reportValidation } = require('../validation/reportValidation');
const { authorization } = require('../middleware/authentication');
const { ROLES } = require('../utils/enum');

router.post(
  '/eventReport',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION, ROLES.USER]),
  validator.body(reportValidation),
  errorHandler(eventReport),
);

router.post(
  '/bookingReport',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION, ROLES.USER]),
  validator.body(reportValidation),
  errorHandler(bookingReport),
);

module.exports = router;
