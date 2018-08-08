## Setup

Install dependencies with `npm i` <br />
Ensure PM2 is installed on your machine with `npm install pm2 -g` <br />
Ensure Redis is installed with `brew install redis` <br />
Launch Redis with `redis-server` <br />
Start API with `pm2 start app.js -i max` <br />

## Endpoints:
/api/570   <== AMD RX570 <br />
/api/1060  <== Nvidia 1060

## Notes
Both endpoints will serve the best coin to mine at the current time against Ethereum. The API will also return supplementary information like the exchange rate (usually with BTC as a trading partner), algorithm used in the calculation and other useful information. Power and equipment costs are not factored into the analysis.

If any other numbers are entered following the '/api/' endpoint, the API will return an error with a message instructing the user to search for either the RX570 or Nvidia 1060.

API was tested with ApacheBench, able to maintain approximately 1500 requests per second.