'use strict';
const parseMoney = require('parse-money').default;
const getCurrencySymbol = require('currency-symbols');

class Price {
  constructor(string) {
    this._string = string;
  }

  get amount() {
    const priceObj = this._string ? parseMoney(this._string) : null;

    return priceObj ? priceObj.amount : null;
  }

  get currency() {
    const priceObj = this._string ? parseMoney(this._string) : null;
    const currency = priceObj ? getCurrencySymbol(priceObj.currency) : null;

    return currency || null;
  }
}

module.exports = Price;
