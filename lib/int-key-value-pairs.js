class intKeyValuePairs {
  constructor() {
    this.strings = {};
    this.ints    = [];
  }

  getByString(str) {
    if (!this.strings[str]) {
      this.strings[str] = this.ints.push(str);
    }
  }

  getByInt(int) {
    return this.ints[int - 1];
  }

  deleteByString(str) {
    let val = this.strings[str];
    if (!val) { return; }

    this.strings[str] =
    this.ints[val]    = undefined;
  }

  deleteByInt(val) {
    let str = this.ints[val];
    if (!str) { return; }

    this.strings[str] =
    this.ints[val]    = undefined;
  }
}

module.exports = intKeyValuePairs;
