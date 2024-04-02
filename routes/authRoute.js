const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const controller = require('../controller/authController');
const { errorHandler } = require('../helper/error');
const { validator } = require('../validation/validator');
const validate = require('../validation/authValidation');
const { authentication } = require('../middleware/authentication');

router.put(
  '/changePassword',
  validator.body(validate.resetPassword),
  authentication,
  errorHandler(controller.resetPassword),
);
router.post('/verifyEmail', errorHandler(controller.verifyEmail));
router.put(
  '/updatePassword',
  validator.body(validate.updatePassword),
  controller.updatePassword,
);

module.exports = router;