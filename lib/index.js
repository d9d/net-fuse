var Server = require('./server');
var Client = require('./client');

module.exports = function(config) {
  if (config.server) {
    new Server(config);
  } else if (config.client) {
    new Client(config);
  } else {
    throw new Error('One of [client|server] is required.');
  }
};
