'use strict';
const { Product } = require('../../models');
const menuAction = require('./menu');

module.exports = async ctx => {
  const productId = ctx.match[1];
  const availabilityAlerts = ctx.match[2];

  await Product.findByIdAndUpdate(productId, { 'preferences.availabilityAlerts': availabilityAlerts });
  await ctx.answerCbQuery();

  await menuAction(ctx);
};
