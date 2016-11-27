const isFunction = require('lodash.isfunction');
const isPlainObject = require('lodash.isplainobject');
const merge = require('lodash.merge');
const isArray = Array.isArray;

module.exports = function joinArrays({
  customizeArray,
  customizeObject,
  key
} = {}) {
  return function (a, b, k) {
    const newKey = key ? `${key}.${k}` : k;
    let resolvedA = a;
    let resolvedB = b;
    let ret;

    if (isFunction(a) && isFunction(b)) {
      resolvedA = a();
      resolvedB = b();
    }

    if (isArray(resolvedA) && isArray(resolvedB)) {
      if (!resolvedB.length) {
        ret = [];
      } else {
        ret = joinArrayPair(customizeArray, newKey, resolvedA, resolvedB);
      }
    } else if (isPlainObject(resolvedA) && isPlainObject(resolvedB)) {
      if (!Object.keys(resolvedB).length) {
        ret = {};
      } else {
        const customResult = customizeObject && customizeObject(
          resolvedA, resolvedB, newKey
        );

        if (customResult) {
          ret = customResult;
        } else {
          ret = merge({}, resolvedA, resolvedB, joinArrays({
            customizeArray,
            customizeObject,
            key: newKey
          }));
        }
      }
    } else {
      ret = resolvedB;
    }

    if (isFunction(a) && isFunction(b)) {
      return () => ret;
    }

    return ret;
  };
};

function joinArrayPair(customizeArray, newKey, a, b) {
  const customResult = customizeArray && customizeArray(a, b, newKey);

  if (customResult) {
    return customResult;
  }

  return a.concat(b);
}
