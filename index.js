const express = require('express');
const app = express();
require('./models/db');
const route = require('./routes/route');

const bodyParse = require('body-parser');

require('dotenv').config();
app.use(express.json());
app.use(bodyParse.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', route);

const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
