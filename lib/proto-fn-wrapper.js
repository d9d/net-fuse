/* - Wraps a function that accepts a callback
 * - Returns a Promise instead of a callback (if the function accepts a callback argument)
 * - Returns a function that takes a proto class and matches params from the proto to function
 *   argument names automatically
 */

var getParams = require('get-parameter-names');
var callbacks = /^(cb|callback_?|done)$/;

module.exports = function(fn) {
  var params = getParams(fn);

  return function(proto) {
    return new Promise(function(resolve, reject) {
      var args = [];
      var cb   = false;

      function getPromiseCallback() {
        cb = true;

        return function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        };
      }

      params.forEach(function(param) {
        args.push(
          callbacks.test(param)       ? getPromiseCallback() :
          proto.hasOwnProperty(param) ? proto[param]         :
          undefined
        );
      });

      try {
        var res = fn.apply(null, args);

        // if there were no callback arguments, just immediately resolve since we can't later
        if (!cb) {
          resolve(res);
        }
      } catch (err) {
        reject(err);
      }
    });
  };
};
