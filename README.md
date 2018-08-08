## Setup

Install dependencies with `npm i`
Ensure PM2 is installed on your machine with `npm install pm2 -g`
Ensure Redis is installed with `npm install redis`
Launch Redis with `redis-server`
Start API with `pm2 start app.js -i max`

## Endpoints:
/api/570   <== AMD RX570 <br />
/api/1060  <== Nvidia 1060

## Notes
Both endpoints will serve the best coin to mine at the current time against Ethereum. The API will also return supplementary information like the exchange rate (usually with BTC as a trading partner), algorithm used in the calculation and other useful information. Power and equipment costs are not factored into the analysis.

If any other numbers are entered following the '/api/' endpoint, the API will return an error with a message instructing the user to search for either the RX570 or Nvidia 1060.