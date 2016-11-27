const isFunction = require('lodash.isfunction');
const isPlainObject = require('lodash.isplainobject');
const mergeWith = require('lodash.mergewith');
const isArray = Array.isArray;

module.exports = function joinArrays({
  customizeArray,
  customizeObject,
  key
} = {}) {
  return function _joinArrays(a, b, k) {
    const newKey = key ? `${key}.${k}` : k;

    if (isFunction(a) && isFunction(b)) {
      return (...args) => _joinArrays(a(...args), b(...args), k);
    }
    if (isArray(a) && isArray(b) && b.length) {
      const customResult = customizeArray && customizeArray(a, b, newKey);

      return customResult ? customResult : [...a, ...b];
    }

    if (isPlainObject(a) && isPlainObject(b) && Object.keys(b).length) {
      const customResult = customizeObject && customizeObject(a, b, newKey);

      return customResult ? customResult : mergeWith({}, a, b, joinArrays({
        customizeArray,
        customizeObject,
        key: newKey
      }));
    }

    return b;
  };
};
