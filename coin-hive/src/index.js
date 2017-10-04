const server = require('./server');
const puppeteer = require('./puppeteer');
const defaults = require('../config/defaults');
const createProxy = require('coin-hive-stratum');

module.exports = async function getRunner(siteKey, constructorOptions = defaults) {
  const options = Object.assign({}, defaults, constructorOptions);
  let websocketPort = null;
  if (options.pool) {
    const proxy = createProxy({ log: false });
    websocketPort = options.port + 1;
    proxy.listen(websocketPort);
  }

  const miner = await new Promise((resolve, reject) => {
    const minerServer = server({
      minerUrl: options.minerUrl,
      websocketPort: websocketPort
    }).listen(options.port, options.host, async (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(
        puppeteer({
          siteKey,
          interval: options.interval,
          port: options.port,
          host: options.host,
          threads: options.threads,
          server: minerServer,
          proxy: options.proxy,
          username: options.username,
          url: options.puppeteerUrl,
          args: ['--no-sandbox']
        })
      );
    });
  });
  await miner.init();
  return miner;
}
