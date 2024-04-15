const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const controller = require('../controller/eventController');
const { errorHandler } = require('../helper/error');
const { validator } = require('../validation/validator');
const validate = require('../validation/eventValidation');
const { authorization } = require('../middleware/authentication');
const { ROLES } = require('../utils/enum');

router.post(
  '/addEvent',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  validator.body(validate.addEvent),
  errorHandler(controller.addEvent),
);

router.post(
  '/addEventImage',
  upload.array('event_image',5),
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  errorHandler(controller.addImage),
);

router.put(
  '/editEvent/:id',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  validator.body(validate.updateEvent),
  errorHandler(controller.updateEvent),
);

router.post(
  '/listOfEvent',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION, ROLES.USER]),
  validator.body(validate.listOfEvent),
  errorHandler(controller.listOfEvent),
);

router.delete(
  '/deleteEvent/:id',
  authorization([ROLES.ADMIN, ROLES.ORGANIZATION]),
  errorHandler(controller.deleteEvent),
);

module.exports = router;