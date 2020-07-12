'use strict';
const cheerio = require('cheerio');
const parseMoney = require('parse-money').default;
const getCurrencySymbol = require('currency-symbols');
const http = require('../helpers/http');

const priceSelectors = ['#priceblock_ourprice', '#priceblock_dealprice', '#priceblock_saleprice'];
const availabilitySelector = '#availability > span';

class AmazonProduct {
  constructor(url) {
    this.url = url;
    this.html = null;
  }

  getPrice() {
    return this._load().then($ => {
      const strPrice = priceSelectors.map(sel => $(sel).text()).find(e => e.length);

      if (!strPrice) {
        return null;
      }

      const price = parseMoney(strPrice);

      return price ? price.amount : null;
    });
  }

  getCurrency() {
    return this._load().then($ => {
      const strPrice = priceSelectors.map(sel => $(sel).text()).find(e => e.length);

      if (!strPrice) {
        return null;
      }

      const price = parseMoney(strPrice);

      return price ? getCurrencySymbol(price.currency) : null;
    });
  }

  getAvailability() {
    return this._load().then($ => $(availabilitySelector).text().trim().replace('.', ''));
  }

  async _load() {
    if (!this.html) {
      const response = await http.get(this.url);

      this.html = response.data;
    }

    return cheerio.load(this.html);
  }
}

module.exports = AmazonProduct;
