var isArray = Array.isArray;
var isPlainObject = require('lodash.isplainobject');
var merge = require('lodash.merge');

module.exports = function(source, target) {
  return merge({}, target, source, joinArrays);

  // concat possible arrays
  function joinArrays(a, b) {
    if(isArray(a) && isArray(b)) {
      return b.concat(a);
    }
    if(isPlainObject(a) && isPlainObject(b)) {
      return merge(a, b, joinArrays);
    }

    return a;
  }
};
