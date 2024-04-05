const express = require('express');
const router = express.Router();
const {
  resetPassword,
  verifyEmail,
  updatePassword,
} = require('../controller/authController');
const { errorHandler } = require('../helper/error');
const { validator } = require('../validation/validator');
const validate = require('../validation/authValidation');
const { authorization } = require('../middleware/authentication');
const { ROLES } = require('../utils/enum');

router.put(
  '/changePassword',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION, ROLES.USER]),
  validator.body(validate.resetPassword),
  errorHandler(resetPassword),
);

router.post('/verifyEmail', errorHandler(verifyEmail));

router.put(
  '/updatePassword',
  validator.body(validate.updatePassword),
  errorHandler(updatePassword),
);

module.exports = router;