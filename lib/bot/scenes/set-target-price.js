'use strict';
const WizardScene = require('telegraf/scenes/wizard');
const { Product } = require('../../models');

const steps = [
  async ctx => {
    await ctx.editMessageText('Enter your target price (0 to remove)');

    ctx.wizard.next();
  },
  async ctx => {
    const productId = ctx.wizard.state.productId;
    const targetPrice = ctx.update.message.text.trim();

    const product = await Product.findByIdAndUpdate(productId, { 'preferences.targetPrice': targetPrice });

    if (targetPrice !== '0') {
      await ctx.reply(product.name + '\'s target price was set to ' + targetPrice + product.currency + '.');
    } else {
      await ctx.reply(product.name + '\'s target price was removed.');
    }

    await ctx.scene.leave();
  }
];

module.exports = new WizardScene('set-target-price', ...steps);
