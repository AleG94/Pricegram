'use strict';
const config = require('config');
const database = require('./lib/database');
const Bot = require('./lib/bot');

const mongoConnectionURI = config.get('mongo.connectionURI');
const telegramBotToken = config.get('telegram.token');

const bot = new Bot(telegramBotToken);

database.connect(mongoConnectionURI).then(() => {
  bot.launch();
});
