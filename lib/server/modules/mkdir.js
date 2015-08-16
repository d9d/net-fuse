var promisify = require('promisify-node');
var fs        = promisify('fs');

module.exports = {
  handler : fs.mkdir
  , mode  : 'write'
};
