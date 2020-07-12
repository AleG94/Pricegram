'use strict';
const WizardScene = require('telegraf/scenes/wizard');
const { Product } = require('../../models');
const validator = require('../../helpers/validator');
const AmazonProduct = require('../../amazon/amazon-product');

const steps = [
  async ctx => {
    await ctx.reply('What\'s the name of the product?');

    ctx.wizard.next();
  },
  async ctx => {
    const name = ctx.update.message.text.trim();
    const user = ctx.update.message.from.id;
    const exists = await Product.exists({ name: name, user: user });

    if (exists) {
      return await ctx.reply(
        'You already have a product with the same name.\nPlease choose another one or type /exit to leave.'
      );
    }

    await ctx.reply('Please insert the URL');

    ctx.wizard.state.name = name;
    ctx.wizard.next();
  },
  async ctx => {
    const url = ctx.update.message.text.trim();

    if (!validator.isUrl(url)) {
      return await ctx.reply('The url is invalid.\nInsert another one or type /exit to leave.');
    }

    const amazonProduct = new AmazonProduct(url);

    const name = ctx.wizard.state.name;
    const user = ctx.update.message.from.id;
    const price = await amazonProduct.getPrice();
    const currency = await amazonProduct.getCurrency();
    const availability = await amazonProduct.getAvailability();

    const product = {
      name: name,
      url: url,
      user: user,
      price: price,
      currency: currency,
      availability: availability,
      lastCheck: Math.floor(Date.now() / 1000)
    };

    await new Product(product).save();
    await ctx.reply('Your product was added 🎉');
    await ctx.scene.leave();
  }
];

const scene = new WizardScene('add-product', ...steps);

scene.command('exit', async ctx => {
  await ctx.scene.leave();
  await ctx.reply('No products were added.');
});

module.exports = scene;