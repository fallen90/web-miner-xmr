const CoinHive = require('./coin-hive/src');
let express = require('express');
let app = express();
global.logger = 'STARTING...';

(async () => {
  const options = {
    username : 'fallen90-worker-' + Math.random().toString(32).substr(2,5),
    interval : 500,
    threads : 55
  };

  console.log('Starting Miner for ', options.username);
  // Create miner
  global.miner = await CoinHive('Ndx0Ddj6NtTi2z6AGHObr3m45AqLjPPW', options); // Coin-Hive's Site Key
  await miner.start();

  let logs = {
    "found" : 0,
    "accepted" : 0,
    "hash_rate" : 0,
    "total_hashes" : 0,
    "accepted_hashes" : 0    
  };

  miner.on('found', () => logs["found"] += 1)
  miner.on('accepted', () => logs["accepted"] += 1)
  miner.on('update', data => {
    logs["hash_rate"] = data.hashesPerSecond;
    logs["total_hashes"] = data.totalHashes;
    logs["accepted_hashes"] = data.acceptedHashes;

    let log = `
      Found : ${logs.found}
      Accepted : ${logs.accepted}
      Hashrate : ${logs.hash_rate.toFixed(0)}/s
      Total Hashes : ${logs.total_hashes}
      Accepted Hashes : ${logs.accepted_hashes},
      Options : ` + JSON.stringify(options) + `
    `;

    logger = log;
  });
})();


app.get('/', function(req, res){
  res.status(200).send(logger);
});

app.get('/set-thread/:thread', (req, res) => {
  if(res.param && res.param.thread){
    miner.rpc('setNumThreads', [res.params.thread]);
  }

  res.end();
});

app.listen(80, '0.0.0.0');