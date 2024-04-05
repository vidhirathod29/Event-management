const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const {
  registration,
  login,
  updateProfile,
  viewProfile,
} = require('../controller/authController');
const { errorHandler } = require('../helper/error');
const { validator } = require('../validation/validator');
const validate = require('../validation/authValidation');
const { authorization } = require('../middleware/authentication');
const { ROLES } = require('../utils/enum');

router.post(
  '/registration',
  upload.single('profile_image'),
  validator.body(validate.registration),
  errorHandler(registration),
);

router.post('/login', validator.body(validate.login), errorHandler(login));

router.put(
  '/editProfile',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  upload.single('profile_image'),
  validator.body(validate.update),
  errorHandler(updateProfile),
);

router.get(
  '/viewProfile',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  errorHandler(viewProfile),
);

module.exports = router;