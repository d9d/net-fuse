var promisify = require( 'promisify-node' );
var fs        = promisify( 'fs' );

module.exports = {
  handler : fs.link
  , mode  : 'write'
};
