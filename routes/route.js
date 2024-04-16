const express = require('express');
const router = express.Router();
const addressRoute = require('./addressRoute')
const userRoute = require('./authRoute');
const dashBoardRoute= require('./dashBoardRoute')

router.use('/user', userRoute);
router.use('/address',addressRoute);
router.use('/dashboard',dashBoardRoute)

module.exports = router;