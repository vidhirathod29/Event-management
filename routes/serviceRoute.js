const express = require('express');
const router = express.Router();
const {
  addService,
  updateService,
  deleteService,
  listOfService,
} = require('../controller/serviceController');
const { errorHandler } = require('../helper/error');
const { validator } = require('../validation/validator');
const validate = require('../validation/serviceValidation');
const { authorization } = require('../middleware/authentication');
const { ROLES } = require('../utils/enum');

router.post(
  '/addService',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  validator.body(validate.addService),
  errorHandler(addService),
);

router.put(
  '/updateService/:id',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  validator.body(validate.updateService),
  errorHandler(updateService),
);

router.delete(
  '/deleteService/:id',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  errorHandler(deleteService),
);

router.post(
  '/listOfService',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION, ROLES.USER]),
  validator.body(validate.listOfService),
  errorHandler(listOfService),
);

module.exports = router;