var err = 0;
var proto;

if (!global.WeakMap || !(proto=WeakMap.prototype).set || !proto.get || !proto.has) {
  err=1, console.error('WeakMap is not supported in this environment');
}

if (err) {
  console.error('Please upgrade your version of node.js / io.js');
  process.exit(1);
}
