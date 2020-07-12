'use strict';
const polling = require('./polling');
const handler = require('./handler');

function start() {
  polling.start();
  polling.on('result', handler.handle);
  polling.on('error', err => console.error(err));
}

function stop() {
  polling.stop();
}

function on(event, listener) {
  handler.on(event, listener);
}

module.exports = { start, stop, on };
