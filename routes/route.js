const express = require('express');
const router = express.Router();
const addressRoute = require('./addressRoute')
const userRoute = require('./authRoute');

router.use('/user', userRoute);
router.use('/address',addressRoute);

module.exports = router;