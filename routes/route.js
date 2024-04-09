const express = require('express');
const router = express.Router();
const userRoute = require('./authRoute');
const serviceRoute = require('./serviceRoute')

router.use('/user', userRoute);
router.use('/serviceManage',serviceRoute)

module.exports = router;