'use strict';
const { Markup } = require('telegraf');

module.exports = products => {
  const items = products.map(product => ({
    text: product.name,
    callbackData: '!menu=' + product.id
  }));

  return Markup.inlineKeyboard([...items.map(e => [Markup.button.callback(e.text, e.callbackData)])]);
};
