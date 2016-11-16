'use strict';

var isPlainObject = require('lodash.isplainobject');
var merge = require('lodash.merge');
var isArray = Array.isArray;

module.exports = function joinArrays() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var customizeArray = _ref.customizeArray;
  var customizeObject = _ref.customizeObject;

  return function (a, b, key) {
    if (isArray(a) && isArray(b)) {
      if (!b.length) {
        return [];
      }

      var customResult = customizeArray && customizeArray(a, b, key);

      if (customResult) {
        return customResult;
      }

      return a.concat(b);
    }

    if (isPlainObject(a) && isPlainObject(b)) {
      if (!Object.keys(b).length) {
        return {};
      }

      var customResult = customizeObject && customizeObject(a, b, key);

      if (customResult) {
        return customResult;
      }

      return merge({}, a, b, joinArrays({
        customizeArray: customizeArray,
        customizeObject: customizeObject
      }));
    }

    return b;
  };
};