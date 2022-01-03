const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  username: String,
  count: Number,
  log: [],
});

module.exports = mongoose.model('log',logSchema);