var Promise   = require('bluebird');
var promisify = require('promisify-node');
var fs        = promisify('fs');

module.exports = {
  handler : function(proto){
    var _fd;

    return fs.open(proto.path, 'r')
      .then(function(fd) {
        _fd = fd;
        var readBuffer = new Buffer();
        return fs.read(fd, readBuffer, proto.offset, proto.length, proto.position);
      })
      .finally(function(fd) {
        _fd && fs.close(_fd);
      });
  }
  , mode  : 'read'
};
