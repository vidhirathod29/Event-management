const express = require('express');
const router = express.Router();
const addressRoute = require('./addressRoute')
const userRoute = require('./authRoute');
const bookingRoute = require('./bookingRoute')

router.use('/user', userRoute);
router.use('/address',addressRoute);
router.use('/booking',bookingRoute)

module.exports = router;