// require the dependencies we installed
const app = require('express')();
const responseTime = require('response-time')
const axios = require('axios');
const redis = require('redis');
const compression = require('compression');
const endpoints = require('./config/endpoints.js');
const morgan = require('morgan');
const winston = require('./config/winston');

// create a new redis client and connect to our local redis instance
const client = redis.createClient();

// if an error occurs, print it to the console
client.on('error', function (err) {
    console.log("Error " + err);
});

// listen on port 4000
app.set('port', (process.env.PORT || 4000));

// set up the response-time middleware
app.use(responseTime());

// Compress all routes
app.use(compression());

// Error logging
app.use(morgan('combined', { stream: winston.stream }));

// centralized error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// call the WhatToMine API to fetch information about the gpu's most profitable coin
getMostProfitableCoin = (gpu) => {
  let wtmEndpoint = ''

  if (gpu === "570") {
    wtmEndpoint = endpoints.amd570;
  } else if (gpu === "1060") {
    wtmEndpoint = endpoints.nvidia1060;
  } else {
    return Promise.reject('invalid search');
  }
  return axios.get(wtmEndpoint);
};

// when a user queries the api with a gpu, return most profitable coins
app.get('/api/:gpu', (req, res) => {
  // get the gpu parameter in the URL
  let gpu = req.params.gpu;

  // use the redis client to get the cached coins
  client.hget(gpu, "best", (error, result, next) => {
      if (result) {
        // the result exists in our cache - return it to our user immediately
        res.send({ "most_profitable_coin": JSON.parse(result) });
      } else {
        // we couldn't find the gpu's results in our cache, so get it
        // from the WhatToMine API
        getMostProfitableCoin(gpu)
          .then((data) => {
            return data.data.coins
          })
          .then((coins) => {
            let biggest = new Object;
            for (let i in coins) {
              biggest = {
                name: i,
                ticker: coins[i].tag,
                algorithm: coins[i].algorithm,
                block_reward: coins[i].block_reward,
                block_time: coins[i].block_time,
                difficulty: coins[i].difficulty,
                exchange_rate: `${coins[i].exchange_rate} against ${coins[i].exchange_rate_curr}`,
                estimated_rewards: coins[i].estimated_rewards,
                current_profit: `${coins[i].profitability}% compared to Ethereum`
              }
              break
            };
            // store most profitable coin in redis cache
            client.hset(gpu, "best", JSON.stringify(biggest), (err, val) => {
              if (err) {
                res.status(500).send('A server error occurred. Please try again later.')
              } else {
                // cached call deletes in 2 minutes (120 seconds) 
                client.expire(gpu, 120, redis.print)
                // return the result to the user
                res.send({ "most_profitable_coin": biggest});
              };
            });
          }).catch((err) => {
            if (err === 'invalid search') {
              res.status(404).send('Invalid search. Please search for either an AMD RX570 or Nvidia 1060')
            } else {
              res.status(500).send('An error occurred. Please try again.')
            }
          });
      };
  });
});

app.listen(app.get('port'),() => {
  console.log('Server listening on port: ', app.get('port'));
});