const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer to a directory in your project
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
