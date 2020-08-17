'use strict';
const WizardScene = require('telegraf/scenes/wizard');
const { Product } = require('../../models');

const steps = [
  async ctx => {
    const productId = ctx.wizard.state.productId;
    const product = await Product.findById(productId);

    await ctx.editMessageText('Enter your target price for ' + product.name + ' (0 to remove)');

    ctx.wizard.next();
  },
  async ctx => {
    const productId = ctx.wizard.state.productId;
    const targetPrice = ctx.update.message.text;

    const product = await Product.findByIdAndUpdate(productId, { 'preferences.targetPrice': targetPrice });

    if (targetPrice !== '0') {
      const currency = product.currency || '';

      await ctx.reply('The target price for ' + product.name + ' was set to ' + targetPrice + currency + '.');
    } else {
      await ctx.reply('The target price for ' + product.name + ' was removed.');
    }

    await ctx.scene.leave();
  }
];

module.exports = new WizardScene('set-target-price', ...steps);
