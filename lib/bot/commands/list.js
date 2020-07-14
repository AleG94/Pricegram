'use strict';
const { Product } = require('../../models');
const keyboards = require('../keyboards');

module.exports = async ctx => {
  const user = ctx.update.message.from.id;
  const products = await Product.find({ user: user });

  if (products.length) {
    await ctx.reply('Choose a product from the list below:', keyboards.list(products));
  } else {
    await ctx.reply('Your product list is empty.');
  }
};
