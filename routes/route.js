const express = require('express');
const router = express.Router();
const addressRoute = require('./addressRoute')
const userRoute = require('./authRoute');
const serviceRoute = require('./serviceRoute');
const eventRoute = require('./eventRoute');

router.use('/user', userRoute);
router.use('/eventManage', eventRoute);
router.use('/serviceManage',serviceRoute);
router.use('/address',addressRoute);

module.exports = router;