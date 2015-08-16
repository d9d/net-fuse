var Promise   = require('bluebird');
var promisify = require('promisify-node');
var fs        = promisify('fs');

module.exports = {
  handler : function(proto){
    var _fd;

    return fs.open(proto.path)
      .then(function(fd) {
        _fd = fd;
        fs.write(fd, proto.bytes, proto.offset, proto.length, proto.position);
        return fd;
      })
      .finally(function(fd) {
        _fd && fs.close(_fd);
      });
  }
  , mode  : 'write'
};
