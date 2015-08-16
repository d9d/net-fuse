var promisify = require('promisify-node');
var fs        = promisify('fs');

module.exports = {
  handler : function(path, mode) {
    var openPromise = fs.open(path, 'wx');

    // If close fails we don't really care, so just return the open promise
    openPromise.then(function(fd) {
      fs.close(fd);
    } );
    return openPromise;
  }
  , mode  : 'create'
};
