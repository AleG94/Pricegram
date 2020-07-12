'use strict';

exports.create = product => {
  let message = `*${product.name}*\n\n`;

  message += '💰  ' + (product.price ? `*${product.price.toFixed(2)} ${product.currency}*` : '-') + '\n\n';
  message += `🧭  ${product.availability}\n\n`;
  message += `[Check here!](${product.url})`;

  return message;
};
