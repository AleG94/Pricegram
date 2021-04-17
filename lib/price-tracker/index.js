'use strict';
const polling = require('./polling');
const handler = require('./handler');
const logger = require('../logger')('tracker');

function start() {
  polling.start();
  polling.on('result', handler.handle);
  polling.on('error', logger.error);
}

function stop() {
  polling.stop();
}

function on(event, listener) {
  handler.on(event, listener);
}

module.exports = { start, stop, on };
