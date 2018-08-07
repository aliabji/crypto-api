const winston = require('winston');

let logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'verbose',
      timestamp: new Date(),
      filename: 'filelog-verbose.log',
      json: false,
    }),
    new winston.transports.File({
      level: 'error',
      timestamp: new Date(),
      filename: 'filelog-error.log',
      json: false,
    })
  ]
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};