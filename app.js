'use strict';
const config = require('config');
const database = require('./lib/database');

const mongoConnectionURI = config.get('mongo.connectionURI');

database.connect(mongoConnectionURI);
