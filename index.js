const CoinHive = require('./coin-hive/src');

(async () => {
  const options = {
    username : 'fallen90-worker-1',
    interval : 500,
    threads : 50
  };
  // Create miner
  const miner = await CoinHive('Ndx0Ddj6NtTi2z6AGHObr3m45AqLjPPW', options); // Coin-Hive's Site Key

  // Start miner
  await miner.start();
  // Listen on events
  miner.on('found', () => console.log('Found!'))
  miner.on('accepted', () => console.log('Accepted!'))
  miner.on('update', data => console.log(`
    Hashes per second: ${data.hashesPerSecond}
    Total hashes: ${data.totalHashes}
    Accepted hashes: ${data.acceptedHashes}
  `));
})();