const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/event-management')
  .then(() => console.log('Connected to MongoDB server successfully..'))
  .catch((err) => console.error('Could not connect to the server ', err));
