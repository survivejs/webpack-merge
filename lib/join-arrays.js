'use strict';

var isFunction = require('lodash.isfunction');
var isPlainObject = require('lodash.isplainobject');
var merge = require('lodash.merge');
var isArray = Array.isArray;

module.exports = function joinArrays() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var customizeArray = _ref.customizeArray;
  var customizeObject = _ref.customizeObject;
  var key = _ref.key;

  return function (a, b, k) {
    var newKey = key ? key + '.' + k : k;
    var resolvedA = a;
    var resolvedB = b;
    var ret = undefined;

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
        var customResult = customizeObject && customizeObject(resolvedA, resolvedB, newKey);

        if (customResult) {
          ret = customResult;
        } else {
          ret = merge({}, resolvedA, resolvedB, joinArrays({
            customizeArray: customizeArray,
            customizeObject: customizeObject,
            key: newKey
          }));
        }
      }
    } else {
      ret = resolvedB;
    }

    if (isFunction(a) && isFunction(b)) {
      return function () {
        return ret;
      };
    }

    return ret;
  };
};

function joinArrayPair(customizeArray, newKey, a, b) {
  var customResult = customizeArray && customizeArray(a, b, newKey);

  if (customResult) {
    return customResult;
  }

  return a.concat(b);
}