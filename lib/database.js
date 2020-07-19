'use strict';
const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  keepAlive: true
};

exports.connect = uri => mongoose.connect(uri, options);
