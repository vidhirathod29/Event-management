const express = require('express');
const router = express.Router();
const {
  listOfCountry,
  listOfState,
  listOfCity,
  addAddress,
  updateAddress,
  deleteAddress,
  listOfAddress,
} = require('../controller/addressController');
const { errorHandler } = require('../helper/error');
const { validator } = require('../validation/validator');
const validate = require('../validation/addressValidation');
const { authorization } = require('../middleware/authentication');
const { ROLES } = require('../utils/enum');

router.get('/listOfCountry', errorHandler(listOfCountry));
router.get('/listOfState', errorHandler(listOfState));
router.get('/listOfCity', errorHandler(listOfCity));
router.post(
  '/addAddress',
  authorization([ROLES.USER]),
  validator.body(validate.addAddress),
  errorHandler(addAddress),
);

router.put(
  '/updateAddress/:id',
  authorization([ROLES.USER]),
  validator.body(validate.updateAddress),
  errorHandler(updateAddress),
);

router.delete(
  '/deleteAddress/:id',
  authorization([ROLES.USER]),
  errorHandler(deleteAddress),
);

router.post(
  '/listOfAddress',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION, ROLES.USER]),
  validator.body(validate.listOfAddress),
  errorHandler(listOfAddress),
);

module.exports = router;