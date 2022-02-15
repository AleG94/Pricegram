'use strict';
const cheerio = require('cheerio');
const Price = require('../helpers/price');

const priceSelectors = [
  '#corePrice_feature_div > div > span > span.a-offscreen',
  '#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center > span > span.a-offscreen',
  '#price',
  '#kindle-price'
];
const availabilitySelector = '#availability > span';

class AmazonProductPage {
  constructor(html) {
    this._$ = cheerio.load(html);
  }

  get fullPrice() {
    return priceSelectors.map(sel => this._$(sel).first().text().trim()).find(e => e.length) || null;
  }

  get price() {
    return new Price(this.fullPrice).amount;
  }

  get currency() {
    return new Price(this.fullPrice).currency;
  }

  get availability() {
    return this._$(availabilitySelector).first().text().trim().replace('.', '');
  }
}

module.exports = AmazonProductPage;
