'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isFunction = require('lodash.isfunction');
var isPlainObject = require('lodash.isplainobject');
var mergeWith = require('lodash.mergewith');
var isArray = Array.isArray;

module.exports = function joinArrays() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      customizeArray = _ref.customizeArray,
      customizeObject = _ref.customizeObject,
      key = _ref.key;

  return function _joinArrays(a, b, k) {
    var newKey = key ? key + '.' + k : k;

    if (isFunction(a) && isFunction(b)) {
      return function () {
        return _joinArrays(a.apply(undefined, arguments), b.apply(undefined, arguments), k);
      };
    }
    if (isArray(a) && isArray(b) && b.length) {
      var customResult = customizeArray && customizeArray(a, b, newKey);

      return customResult ? customResult : [].concat(_toConsumableArray(a), _toConsumableArray(b));
    }

    if (isPlainObject(a) && isPlainObject(b) && Object.keys(b).length) {
      var _customResult = customizeObject && customizeObject(a, b, newKey);

      return _customResult ? _customResult : mergeWith({}, a, b, joinArrays({
        customizeArray: customizeArray,
        customizeObject: customizeObject,
        key: newKey
      }));
    }

    return b;
  };
};