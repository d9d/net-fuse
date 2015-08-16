const KV = require('./int-key-value-pairs');

class FDs extends KV {
  getPath(FD) {
    return this.getById(FD);
  }

  getFD(path) {
    return this.getByString(path) || '';
  }

  deleteFD(FD) {
    return this.deleteByInt(FD);
  }
}

module.exports = new FDs();
