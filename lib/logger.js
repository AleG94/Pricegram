'use strict';
const log4js = require('log4js');

module.exports = category => {
  const logger = log4js.getLogger(category);

  logger.level = log4js.levels.ALL;

  return logger;
};
