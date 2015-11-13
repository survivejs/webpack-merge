var isArray = Array.isArray;
var isPlainObject = require('lodash.isplainobject');
var merge = require('lodash.merge');

module.exports = function() {
  var args = Array.prototype.slice.call(arguments);
  args.reverse();

  return merge.apply(null, [{}].concat(args).concat([joinArrays]));
};

function joinArrays(a, b) {
  if(isArray(a) && isArray(b)) {
    return b.concat(a);
  }
  if(isPlainObject(a) && isPlainObject(b)) {
    return merge(a, b, joinArrays);
  }

  return a;
}
