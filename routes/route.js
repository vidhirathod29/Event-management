const express = require('express');
const router = express.Router();
const userRoute = require('./authRoute');

router.use('/user', userRoute);

module.exports = router;
