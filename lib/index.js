'use strict';

var lodashMerge = require('lodash.merge');
var joinArrays = require('./join-arrays');
var reduceLoaders = require('./reduce-loaders');

function merge() {
  var _ref;

  return lodashMerge.apply(null, (_ref = [{}]).concat.apply(_ref, arguments).concat([joinArrays.bind(null, function () {})]));
}

function mergeSmart() {
  var _ref2;

  return lodashMerge.apply(null, (_ref2 = [{}]).concat.apply(_ref2, arguments).concat([joinArrays.bind(null, function (a, b, key) {
    if (isLoader(key)) {
      return a.reduce(reduceLoaders, b.slice());
    }
  })]));
}

function mergeStrategy() {
  return merge.apply(undefined, arguments);
}

function isLoader(key) {
  return ['preLoaders', 'loaders', 'postLoaders', 'rules'].indexOf(key) >= 0;
}

module.exports = merge;
module.exports.smart = mergeSmart;
module.exports.strategy = mergeStrategy;