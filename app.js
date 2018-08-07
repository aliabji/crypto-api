// require the dependencies we installed
var app = require('express')();
var responseTime = require('response-time')
var axios = require('axios');
var redis = require('redis');

// create a new redis client and connect to our local redis instance
var client = redis.createClient();

// if an error occurs, print it to the console
client.on('error', function (err) {
    console.log("Error " + err);
});

app.set('port', (process.env.PORT || 4000));
// set up the response-time middleware
app.use(responseTime());

// call the WhatToMine API to fetch information about the gpu's most profitable coin
function getMostProfitableCoin(gpu) {
  var wtmEndpoint = ''

  if (gpu === "570") {
    wtmEndpoint = 'https://whattomine.com/coins.json?utf8=%E2%9C%93&adapt_q_280x=0&adapt_q_380=0&adapt_q_fury=0&adapt_q_470=0&adapt_q_480=0&adapt_q_570=1&adapt_570=true&adapt_q_580=0&adapt_q_vega56=0&adapt_q_vega64=0&adapt_q_750Ti=0&adapt_q_1050Ti=0&adapt_q_10606=0&adapt_q_1070=0&adapt_q_1070Ti=0&adapt_q_1080=0&adapt_q_1080Ti=0&eth=true&factor%5Beth_hr%5D=27.90&factor%5Beth_p%5D=120.00&zh=true&factor%5Bzh_hr%5D=0.00&factor%5Bzh_p%5D=0.00&phi=true&factor%5Bphi_hr%5D=13.00&factor%5Bphi_p%5D=120.00&cnh=true&factor%5Bcnh_hr%5D=630.00&factor%5Bcnh_p%5D=110.00&cn7=true&factor%5Bcn7_hr%5D=830.00&factor%5Bcn7_p%5D=110.00&eq=true&factor%5Beq_hr%5D=260.00&factor%5Beq_p%5D=110.00&lre=true&factor%5Blrev2_hr%5D=29500.00&factor%5Blrev2_p%5D=120.00&ns=true&factor%5Bns_hr%5D=700.00&factor%5Bns_p%5D=140.00&tt10=true&factor%5Btt10_hr%5D=8.00&factor%5Btt10_p%5D=115.00&x16r=true&factor%5Bx16r_hr%5D=5.00&factor%5Bx16r_p%5D=100.00&l2z=true&factor%5Bl2z_hr%5D=0.42&factor%5Bl2z_p%5D=110.00&phi2=true&factor%5Bphi2_hr%5D=0.00&factor%5Bphi2_p%5D=0.00&xn=true&factor%5Bxn_hr%5D=0.00&factor%5Bxn_p%5D=0.00&factor%5Bcost%5D=0.0&sort=Profitability24&volume=0&revenue=24h&factor%5Bexchanges%5D%5B%5D=&factor%5Bexchanges%5D%5B%5D=binance&factor%5Bexchanges%5D%5B%5D=bitfinex&factor%5Bexchanges%5D%5B%5D=bittrex&factor%5Bexchanges%5D%5B%5D=cryptobridge&factor%5Bexchanges%5D%5B%5D=cryptopia&factor%5Bexchanges%5D%5B%5D=hitbtc&factor%5Bexchanges%5D%5B%5D=poloniex&factor%5Bexchanges%5D%5B%5D=yobit&dataset=&commit=Calculate';
  } else {
    wtmEndpoint = 'https://whattomine.com/coins.json?utf8=%E2%9C%93&adapt_q_280x=0&adapt_q_380=0&adapt_q_fury=0&adapt_q_470=0&adapt_q_480=0&adapt_q_570=0&adapt_q_580=0&adapt_q_vega56=0&adapt_q_vega64=0&adapt_q_750Ti=0&adapt_q_1050Ti=0&adapt_q_10606=1&adapt_10606=true&adapt_q_1070=0&adapt_q_1070Ti=0&adapt_q_1080=0&adapt_q_1080Ti=0&eth=true&factor%5Beth_hr%5D=22.50&factor%5Beth_p%5D=90.00&zh=true&factor%5Bzh_hr%5D=23.00&factor%5Bzh_p%5D=90.00&phi=true&factor%5Bphi_hr%5D=12.00&factor%5Bphi_p%5D=90.00&cnh=true&factor%5Bcnh_hr%5D=450.00&factor%5Bcnh_p%5D=70.00&cn7=true&factor%5Bcn7_hr%5D=430.00&factor%5Bcn7_p%5D=70.00&eq=true&factor%5Beq_hr%5D=270.00&factor%5Beq_p%5D=90.00&lre=true&factor%5Blrev2_hr%5D=20300.00&factor%5Blrev2_p%5D=90.00&ns=true&factor%5Bns_hr%5D=620.00&factor%5Bns_p%5D=90.00&tt10=true&factor%5Btt10_hr%5D=11.00&factor%5Btt10_p%5D=90.00&x16r=true&factor%5Bx16r_hr%5D=5.00&factor%5Bx16r_p%5D=80.00&l2z=true&factor%5Bl2z_hr%5D=1.10&factor%5Bl2z_p%5D=80.00&phi2=true&factor%5Bphi2_hr%5D=2.30&factor%5Bphi2_p%5D=90.00&xn=true&factor%5Bxn_hr%5D=2.10&factor%5Bxn_p%5D=90.00&factor%5Bcost%5D=0.0&sort=Profitability24&volume=0&revenue=24h&factor%5Bexchanges%5D%5B%5D=&factor%5Bexchanges%5D%5B%5D=binance&factor%5Bexchanges%5D%5B%5D=bitfinex&factor%5Bexchanges%5D%5B%5D=bittrex&factor%5Bexchanges%5D%5B%5D=cryptobridge&factor%5Bexchanges%5D%5B%5D=cryptopia&factor%5Bexchanges%5D%5B%5D=hitbtc&factor%5Bexchanges%5D%5B%5D=poloniex&factor%5Bexchanges%5D%5B%5D=yobit&dataset=&commit=Calculate'
  }
  return axios.get(wtmEndpoint);
}

// when a user queries the api with a gpu, return most profitable coins
app.get('/api/:gpu', function(req, res) {
  // get the gpu parameter in the URL
  var gpu = req.params.gpu;

  // use the redis client to get the cached coins
  client.hget(gpu, "best", (error, result) => {
      if (result) {
        // the result exists in our cache - return it to our user immediately
        res.send({ "coins": JSON.parse(result), "source": "redis cache" });
      } else {
        // we couldn't find the gpu's results in our cache, so get it
        // from the WhatToMine API
        getMostProfitableCoin(gpu)
          .then((data) => {
            return data.data.coins
          })
          .then((coins) => {
            let biggest = new Object;
            for (var i in coins) {
              if (coins[i].profitability > biggest.profitability || biggest.profitability === undefined) {
                biggest = coins[i]
                biggest.name = i
              };
            };
            client.hset(gpu, "best", JSON.stringify(biggest), (err, val) => {
              if (err) {
                throw err;
              } else {
                // cached call deletes in 2 minutes (120 seconds) 
                client.expire(gpu, 120, redis.print)
                // return the result to the user
                res.send({ "coins": biggest});
              };
            });
          }).catch((response) => {
            if (response.status === 404){
              res.send('An error occurred!');
            } else {
              res.send(response);
            };
          });
      };
  });
});

app.listen(app.get('port'),() => {
  console.log('Server listening on port: ', app.get('port'));
});