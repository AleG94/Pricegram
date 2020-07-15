'use strict';
const { URL } = require('url');

exports.isUrl = string => {
  try {
    const url = new URL(string);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
};
