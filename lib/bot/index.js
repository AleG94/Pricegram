'use strict';
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

const scenes = require('./scenes');
const commands = require('./commands');
const actions = require('./actions');
const errorHandler = require('./error-handler');

const stage = new Stage(Object.values(scenes));

const welcomeMessage = '*Welcome to Pricegram*\n\n' +
  'Start saving money by tracking Amazon products and receive ' +
  'price and availability alerts according to your preferences.\n\n' +
  '_Commands_\n\n' +
  '/track - track a new product\n' +
  '/list - manage your products';

class Bot extends Telegraf {
  constructor(token, options) {
    super(token, options);

    this.use(session());
    this.use(stage.middleware());

    this.catch(errorHandler);

    this.start(ctx => ctx.replyWithMarkdown(welcomeMessage));

    this.command('track', commands.track);
    this.command('list', commands.list);

    this.action('!list', actions.list);
    this.action(/^!menu=(\w+)$/, actions.menu);
    this.action(/^!remove\?id=(\w+)$/, actions.remove);
    this.action(/^!availability\?id=(\w+)&value=(\w+)$/, actions.availability);
    this.action(/^!price\?id=(\w+)$/, actions.price);
  }

  sendMessage(user, message) {
    // eslint-disable-next-line
    this.telegram.sendMessage(user, message, { parse_mode: 'Markdown', disable_web_page_preview: true });
  }
}

module.exports = Bot;
