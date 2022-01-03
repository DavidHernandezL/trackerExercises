const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const routes = require('./routes/index');

//Database
require('./database');

//Config
const app = express();
//Middleware  
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors())
app.use(express.static('public'))

//Routes
routes(app);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
