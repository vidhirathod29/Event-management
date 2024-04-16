const express = require('express');
const router = express.Router();
const addressRoute = require('./addressRoute');
const userRoute = require('./authRoute');
const dashBoardRoute = require('./dashBoardRoute');
const bookingRoute = require('./bookingRoute')
const serviceRoute = require('./serviceRoute');
const eventRoute = require('./eventRoute');

router.use('/user', userRoute);
router.use('/eventManage', eventRoute);
router.use('/serviceManage', serviceRoute);
router.use('/address', addressRoute);
router.use('/booking',bookingRoute);
router.use('/dashboard', dashBoardRoute);

module.exports = router;