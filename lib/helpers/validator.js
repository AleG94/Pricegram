'use strict';

exports.isUrl = string => {
  try {
    const url = new URL(string);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
};
