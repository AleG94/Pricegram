'use strict';
const mongoose = require('mongoose');

exports.connect = uri => mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  keepAlive: true
});
