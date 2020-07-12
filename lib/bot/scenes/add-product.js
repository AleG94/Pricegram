'use strict';
const WizardScene = require('telegraf/scenes/wizard');
const { Product } = require('../../models');
const http = require('../../helpers/http');
const validator = require('../../helpers/validator');
const AmazonProductPage = require('../../amazon/amazon-product-page');

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
        'You already have a product with the same name. Please choose another one or use /exit to leave.'
      );
    }

    await ctx.reply('Insert the URL');

    ctx.wizard.state.name = name;
    ctx.wizard.next();
  },
  async ctx => {
    const url = ctx.update.message.text.trim();

    if (!validator.isUrl(url)) {
      return await ctx.reply('Your inserted an invalid URL, please try again or use /exit to leave.');
    }

    await ctx.reply('Retrieving product info...');

    const response = await http.get(url);
    const productPage = new AmazonProductPage(response.data);

    const product = {
      name: ctx.wizard.state.name,
      url: url,
      user: ctx.update.message.from.id,
      price: productPage.price,
      currency: productPage.currency,
      availability: productPage.availability,
      lastCheck: Math.floor(Date.now() / 1000)
    };

    await new Product(product).save();
    await ctx.reply('Your product is being tracked 🎉');
    await ctx.scene.leave();
  }
];

const scene = new WizardScene('add-product', ...steps);

scene.command('exit', async ctx => {
  await ctx.scene.leave();
  await ctx.reply('No products were added.');
});

module.exports = scene;
