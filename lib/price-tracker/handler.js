'use strict';
const config = require('config');
const EventEmitter = require('events');
const AmazonProductPage = require('../amazon/amazon-product-page');
const http = require('../helpers/http');
const random = require('../helpers/random');

const minBackoff = config.get('tracker.requests.backoff.min') * 1000;
const maxBackoff = config.get('tracker.requests.backoff.max') * 1000;

const emitter = new EventEmitter();

exports.handle = async products => {
  for (const product of products) {
    try {
      const response = await http.get(product.url);
      const productPage = new AmazonProductPage(response.data);
      const price = productPage.price;
      const availability = productPage.availability;

      const availabilityAlerts = product.preferences.availabilityAlerts;
      const targetPrice = product.preferences.targetPrice;
      const sendAlert = price != null &&
        (product.price !== price && (targetPrice === 0 || product.price <= targetPrice)) ||
        (availabilityAlerts && product.availability !== availability);

      product.price = price;
      product.availability = availability;
      product.lastCheck = Math.floor(Date.now() / 1000);

      await product.save();

      if (sendAlert) {
        emitter.emit('update', product);
      }

      await new Promise(resolve => setTimeout(resolve, random(minBackoff, maxBackoff)));
    } catch (err) {
      console.error('Could not update product ' + product.name, err);
    }
  }
};

exports.on = (event, listener) => emitter.on(event, listener);
