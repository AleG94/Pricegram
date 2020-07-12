'use strict';
const { Product } = require('../../models');
const keyboards = require('../keyboards');

module.exports = async ctx => {
  const productId = ctx.match[1];
  const product = await Product.findById(productId);

  await ctx.answerCbQuery();
  await ctx.editMessageText(product.name, keyboards.menu(product));
};
