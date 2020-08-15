'use strict';
const cheerio = require('cheerio');
const parseMoney = require('parse-money').default;
const getCurrencySymbol = require('currency-symbols');

const priceSelector = '#buybox span.a-color-price';
const availabilitySelector = '#availability > span';

class AmazonProductPage {
  constructor(html) {
    this._$ = cheerio.load(html);
  }

  get price() {
    const rawPrice = this._$(priceSelector).first().text().trim();
    const priceObj = rawPrice ? parseMoney(rawPrice) : null;

    return priceObj ? priceObj.amount : null;
  }

  get currency() {
    const rawPrice = this._$(priceSelector).first().text().trim();
    const priceObj = rawPrice ? parseMoney(rawPrice) : null;
    const currency = priceObj ? getCurrencySymbol(priceObj.currency) : null;

    return currency || null;
  }

  get availability() {
    return this._$(availabilitySelector).text().trim().replace('.', '');
  }
}

module.exports = AmazonProductPage;
