'use strict';
const config = require('config');
const database = require('./lib/database');
const Bot = require('./lib/bot');
const priceTracker = require('./lib/price-tracker');
const Alert = require('./lib/templates/alert');

const mongoConnectionURI = config.get('mongo.connectionURI');
const telegramBotToken = config.get('telegram.token');

const bot = new Bot(telegramBotToken);

database.connect(mongoConnectionURI).then(() => {
  bot.launch();
  priceTracker.start();
  priceTracker.on('update', product => bot.sendMessage(product.user, new Alert(product).toMarkdown()));
});
