'use strict';
const config = require('config');
const EventEmitter = require('events');
const { Product } = require('../models');
const random = require('../helpers/random');

const minInterval = config.get('tracker.polling.interval.min') * 1000;
const maxInterval = config.get('tracker.polling.interval.max') * 1000;
const checkInterval = config.get('tracker.products.checkInterval');

class Polling {
  constructor() {
    this._running = false;
    this._emitter = new EventEmitter();
  }

  start() {
    this._running = true;
    this._poll();
  }

  stop() {
    this._running = false;
  }

  on(event, listener) {
    this._emitter.on(event, listener);
  }

  _poll() {
    const now = Math.floor(Date.now() / 1000);

    Product.find({ lastCheck: { $lt: now - checkInterval } })
      .then(products => this._emitter.emit('result', products))
      .catch(err => this._emitter.emit('error', err));

    setTimeout(() => this._running && this._poll(), random(minInterval, maxInterval));
  }
}

module.exports = new Polling();
