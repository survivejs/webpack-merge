'use strict';

var isPlainObject = require('lodash.isplainobject');
var merge = require('lodash.merge');
var isArray = Array.isArray;

module.exports = function joinArrays(customizer, a, b, key) {
  if (isArray(a) && isArray(b)) {
    var customResult = customizer(a, b, key);

    if (!b.length) {
      return [];
    }

    if (customResult) {
      return customResult;
    }

    return a.concat(b);
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    if (!Object.keys(b).length) {
      return {};
    }

    return merge({}, a, b, joinArrays.bind(null, customizer));
  }

  return b;
};