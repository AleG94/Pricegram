'use strict';
const cheerio = require('cheerio');
const Price = require('../helpers/price');

const priceSelector = '#buybox span.a-color-price';
const availabilitySelector = '#availability > span';

class AmazonProductPage {
  constructor(html) {
    this._$ = cheerio.load(html);
  }

  get fullPrice() {
    return this._$(priceSelector).first().text().trim() || null;
  }

  get price() {
    return new Price(this.fullPrice).amount;
  }

  get currency() {
    return new Price(this.fullPrice).currency;
  }

  get availability() {
    return this._$(availabilitySelector).text().trim().replace('.', '');
  }
}

module.exports = AmazonProductPage;
