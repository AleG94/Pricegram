'use strict';
const config = require('config');
const EventEmitter = require('events');
const { Product } = require('../models');
const AmazonProductPage = require('../amazon/amazon-product-page');
const http = require('../helpers/http');
const random = require('../helpers/random');

const minBackoff = config.get('tracker.requests.backoff.min') * 1000;
const maxBackoff = config.get('tracker.requests.backoff.max') * 1000;

const emitter = new EventEmitter();

exports.handle = async products => {
  for (const product of products) {
    try {
      const html = await http.get(product.url);
      const productPage = new AmazonProductPage(html);
      const currentPrice = productPage.price;
      const currentAvailability = productPage.availability;

      const availabilityAlerts = product.preferences.availabilityAlerts;
      const targetPrice = product.preferences.targetPrice;
      const sendAlert =
        (currentPrice !== product.price && (!targetPrice || currentPrice <= targetPrice)) ||
        (currentAvailability !== product.availability && availabilityAlerts);

      const updatedProduct = await Product.findByIdAndUpdate(
        product.id,
        {
          price: currentPrice,
          currency: product.currency || productPage.currency,
          availability: currentAvailability,
          lastCheck: Math.floor(Date.now() / 1000)
        },
        { new: true }
      );

      if (sendAlert) {
        emitter.emit('update', updatedProduct);
      }

      await new Promise(resolve => setTimeout(resolve, random(minBackoff, maxBackoff)));
    } catch (err) {
      console.error('Could not update product ' + product.name, err);
    }
  }
};

exports.on = (event, listener) => emitter.on(event, listener);
