var hexu = require('hexu');

module.exports.log = function(msg, color) {
  console.log(hexu[color](msg));
}


module.exports.error = function(msg) {
  throw new Error("[Sold] ERR: " + msg);
}
