'use strict';

var lodashMerge = require('lodash.merge');
var joinArrays = require('./join-arrays');
var reduceLoaders = require('./reduce-loaders');

function merge() {
  var _ref;

  return lodashMerge.apply(null, (_ref = [{}]).concat.apply(_ref, arguments).concat([joinArrays()]));
}

function mergeSmart() {
  var _ref2;

  return lodashMerge.apply(null, (_ref2 = [{}]).concat.apply(_ref2, arguments).concat([joinArrays({
    customizeArray: function customizeArray(a, b, key) {
      if (isLoader(key)) {
        return a.reduce(reduceLoaders, b.slice());
      }
    }
  })]));
}

function mergeStrategy() {
  var rules = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  // rules: { <field>: <'append'|'prepend'> }
  // All default to append but you can override here
  return function () {
    var _ref3;

    return lodashMerge.apply(null, (_ref3 = [{}]).concat.apply(_ref3, arguments).concat([joinArrays({
      customizeArray: function customizeArray(a, b, key) {
        if (rules[key]) {
          return rules[key] === 'prepend' && b.concat(a);
        }
      },
      customizeObject: function customizeObject(a, b, key) {
        if (rules[key]) {
          // No support for recursive checks yet - are those even needed?
          return rules[key] === 'prepend' && lodashMerge({}, b, a, joinArrays());
        }
      }
    })]));
  };
}

function isLoader(key) {
  return ['preLoaders', 'loaders', 'postLoaders', 'rules'].indexOf(key) >= 0;
}

module.exports = merge;
module.exports.smart = mergeSmart;
module.exports.strategy = mergeStrategy;