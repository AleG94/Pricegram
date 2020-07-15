'use strict';
const Markup = require('telegraf/markup');

module.exports = product => {
  const availabilityAlerts = product.preferences.availabilityAlerts;
  const targetPrice = product.preferences.targetPrice;

  const items = [
    {
      text: '💰  Set target price ' + (targetPrice ? '(' + product.currency + ' ' + targetPrice + ')' : ''),
      callbackData: '!price?id=' + product.id
    },
    {
      text: '🧭  Availability alerts: ' + (availabilityAlerts ? 'ON' : 'OFF'),
      callbackData: '!availability?id=' + product.id + '&value=' + !availabilityAlerts
    },
    {
      text: '🗑  Delete',
      callbackData: '!remove?id=' + product.id
    },
    {
      text: '      <<  Back to products list      ',
      callbackData: '!list'
    }
  ];

  return Markup.inlineKeyboard([...items.map(e => [Markup.callbackButton(e.text, e.callbackData)])]).extra();
};
