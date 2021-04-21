'use strict';
const { Scenes } = require('telegraf');
const extractDomain = require('extract-domain');
const logger = require('../../logger')('bot');
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
    const name = ctx.update.message.text;
    const user = ctx.update.message.from.id;
    const exists = await Product.exists({ name: name, user: user });

    if (exists) {
      return await ctx.reply(
        'You already have a product with the same name. Please choose another one or use /exit to leave.'
      );
    }

    await ctx.reply('Insert the URL or share the product with Pricegram from the Amazon app');

    ctx.wizard.state.name = name;
    ctx.wizard.next();
  },
  async ctx => {
    const message = ctx.update.message.text;
    const urls = message.match(/\bhttps?:\/\/\S+/gi);

    if (!urls) {
      return await ctx.reply('This is not a valid URL, please try again or use /exit to leave.');
    }

    const url = urls[0];
    const domain = extractDomain(url);

    if (!validator.isUrl(url) || !domain.startsWith('amazon.')) {
      return await ctx.reply('This is not a valid Amazon product, please try again or use /exit to leave.');
    }

    await ctx.reply('Retrieving product info...');

    const html = await http.get(url);
    const productPage = new AmazonProductPage(html);

    const product = new Product({
      name: ctx.wizard.state.name,
      url: url,
      user: ctx.update.message.from.id,
      price: productPage.price,
      currency: productPage.currency,
      availability: productPage.availability,
      lastCheck: Math.floor(Date.now() / 1000)
    });

    await product.save();

    logger.info(`Product added: ${product.name} (${product.id}) - ${product.price} - ${product.availability}`);

    await ctx.reply('Your product is being tracked 🎉');
    await ctx.scene.leave();
  }
];

const scene = new Scenes.WizardScene('add-product', ...steps);

scene.command('exit', async ctx => {
  await ctx.scene.leave();
  await ctx.reply('The operation was aborted.');
});

module.exports = scene;
