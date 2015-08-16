const KV = require('./int-key-value-pairs');

class INodes extends KV {
  getPath(iNode) {
    return this.getById(iNode) || '';
  }

  getiNode(path) {
    return this.getByString(path);
  }
}

module.exports = new INodes();
