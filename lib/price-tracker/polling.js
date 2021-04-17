'use strict';
const config = require('config');
const EventEmitter = require('events');
const { Product } = require('../models');
const random = require('../helpers/random');

const averageInterval = config.get('tracker.polling.averageInterval') * 1000;
const minInterval = averageInterval * 0.9;
const maxInterval = averageInterval * 1.1;

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

  async _poll() {
    try {
      const products = await Product.find();

      this._emitter.emit('result', products);
    } catch (err) {
      this._emitter.emit('error', err);
    } finally {
      setTimeout(() => this._running && this._poll(), random(minInterval, maxInterval));
    }
  }
}

module.exports = new Polling();
