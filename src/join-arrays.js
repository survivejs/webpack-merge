const isFunction = require('lodash.isfunction');
const isPlainObject = require('lodash.isplainobject');
const merge = require('lodash.merge');
const isArray = Array.isArray;

module.exports = function joinArrays(
    {
        customizeArray,
        customizeObject,
        key
    } = {}
) {
  return function _joinArrays(a, b, k) {
    const newKey = key ? `${key}.${k}` : k;

    if (isFunction(a) && isFunction(b)) {
      return (...args) => _joinArrays(a(...args), b(...args), k);
    }

    if (isArray(a) && isArray(b)) {
      if (!b.length) {
        return [];
      }
      const customResult = customizeArray && customizeArray(a, b, newKey);

      if (customResult) {
        return customResult;
      }

      return a.concat(b);
    }

    if (isPlainObject(a) && isPlainObject(b)) {
      if (!Object.keys(b).length) {
        return {};
      }

      const customResult = customizeObject && customizeObject(a, b, newKey);

      if (customResult) {
        return customResult;
      }

      return merge({}, a, b, joinArrays({
        customizeArray,
        customizeObject,
        key: newKey
      }));
    }

    return b;
  };
};
