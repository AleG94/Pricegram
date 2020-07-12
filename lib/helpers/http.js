'use strict';
const axios = require('axios');

const headers = {
  // eslint-disable-next-line
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
  'referer': 'https://google.it',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'it-IT,it;q=0.8,en-US;q=0.5,en;q=0.3',
  'pragma': 'no-cache',
  'cache-control': 'no-cache'
};

exports.get = url => axios.get(url, { headers: headers });
