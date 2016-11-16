const isPlainObject = require('lodash.isplainobject');
const merge = require('lodash.merge');
const isArray = Array.isArray;

module.exports = function joinArrays({
  customizeArray,
  customizeObject
} = {}) {
  return function (a, b, key) {
    if (isArray(a) && isArray(b)) {
      if (!b.length) {
        return [];
      }

      const customResult = customizeArray && customizeArray(a, b, key);

      if (customResult) {
        return customResult;
      }

      return a.concat(b);
    }

    if (isPlainObject(a) && isPlainObject(b)) {
      if (!Object.keys(b).length) {
        return {};
      }

      const customResult = customizeObject && customizeObject(a, b, key);

      if (customResult) {
        return customResult;
      }

      return merge({}, a, b, joinArrays({
        customizeArray,
        customizeObject
      }));
    }

    return b;
  };
};
