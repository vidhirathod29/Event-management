const express = require('express');
const router = express.Router();
const controller = require('../controller/addressController');
const { errorHandler } = require('../helper/error');

router.get('/listOfCountry',errorHandler(controller.listOfCountry));
router.get('/listOfState',errorHandler(controller.listOfState));
router.get('/listOfCity',errorHandler(controller.listOfCity));

module.exports= router;