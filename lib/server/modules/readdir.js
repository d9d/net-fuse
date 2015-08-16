var promisify = require( 'promisify-node' );
var fs        = promisify( 'fs' );

module.exports = {
  handler : fs.readdir
  , mode  : 'read'
};
