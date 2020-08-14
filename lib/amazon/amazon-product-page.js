'use strict';
const cheerio = require('cheerio');
const parseMoney = require('parse-money').default;
const getCurrencySymbol = require('currency-symbols');

const priceSelector = '#buybox span.a-color-price';
const availabilitySelector = '#availability > span';

class AmazonProductPage {
  constructor(html) {
    this._html = html;
    this.$ = cheerio.load(html);
    this.price = null;
    this.currency = null;
    this.availability = null;
    this._parse();
  }

  _parse() {
    const strPrice = this.$(priceSelector).first().text().trim();

    if (strPrice) {
      const price = parseMoney(strPrice);

      this.price = price.amount || null;
      this.currency = getCurrencySymbol(price.currency) || null;
    }

    this.availability = this.$(availabilitySelector).text().trim().replace('.', '');
  }
}

module.exports = AmazonProductPage;
