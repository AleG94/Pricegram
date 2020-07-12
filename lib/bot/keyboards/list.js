'use strict';
const Markup = require('telegraf/markup');

module.exports = products => {
  const items = products.map(product => ({
    text: product.name,
    callbackData: '!menu=' + product.id
  }));

  return Markup.inlineKeyboard([...items.map(e => [Markup.callbackButton(e.text, e.callbackData)])]).extra();
};
