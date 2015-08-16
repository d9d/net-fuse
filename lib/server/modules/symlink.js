var promisify = require( 'promisify-node' );
var fs        = promisify( 'fs' );

module.exports = {
  handler : fs.symlink
  , mode  : 'write'
};
