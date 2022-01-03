const mongoose = require('mongoose');
//Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connection with DB succesfully'))
  .catch((err) => console.error(err));