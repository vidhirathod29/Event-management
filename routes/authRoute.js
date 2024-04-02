const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const controller = require('../controller/authController');
const { errorHandler } = require('../helper/error');
const { validator } = require('../validation/validator');
const validate = require('../validation/authValidation');
const { authentication } = require('../middleware/authentication');

router.post(
  '/registration',
  upload.single('profile_image'),
  validator.body(validate.registration),
  errorHandler(controller.registration),
);
router.post('/login', validator.body(validate.login), controller.login);
router.put(
  '/editProfile',
  upload.single('profile_image'),
  validator.body(validate.update),
  authentication,
  errorHandler(controller.updateProfile),
);
router.get(
  '/viewProfile',
  authentication,
  errorHandler(controller.viewProfile),
);

module.exports = router;