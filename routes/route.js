const express = require('express');
const router = express.Router();
const addressRoute = require('./addressRoute');

router.use('/address', addressRoute);

module.exports = router;