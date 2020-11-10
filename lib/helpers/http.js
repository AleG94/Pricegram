'use strict';
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

exports.get = async url => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const pages = await browser.pages();
  const page = pages[0];

  await page.goto(url, { waitUntil: 'networkidle2' });

  const html = await page.content();

  await page.close();
  await browser.close();

  return html;
};
