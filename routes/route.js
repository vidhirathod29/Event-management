const express = require('express');
const router = express.Router();
const userRoute = require('./authRoute');
const eventRoute = require('./eventRoute');

router.use('/user', userRoute);
router.use('/eventManage', eventRoute);

module.exports = router;