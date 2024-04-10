const express = require('express');
const router = express.Router();
const addressRoute = require('./addressRoute')
const userRoute = require('./authRoute');
const serviceRoute = require('./serviceRoute')

router.use('/user', userRoute);
router.use('/serviceManage',serviceRoute)
router.use('/address',addressRoute);

module.exports = router;