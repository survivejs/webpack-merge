'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isArray = Array.isArray;
var isPlainObject = require('lodash.isplainobject');
var merge = require('lodash.merge');
var find = require('lodash.find');

var loaderNameRe = new RegExp(/[a-z\-]/ig);

function reduceLoaders(mergedLoaderConfigs, loaderConfig) {
  var foundLoader = find(mergedLoaderConfigs, function (l) {
    return String(l.test) === String(loaderConfig.test);
  });

  // foundLoader.loader is intentionally ignored, because a string loader value should always override
  if (foundLoader && foundLoader.loaders) {
    var newLoaders = loaderConfig.loader ? [loaderConfig.loader] : loaderConfig.loaders || [];

    foundLoader.loaders = newLoaders.reduce(function (mergedLoaders, loader) {
      var loaderName = loader.match(loaderNameRe)[0];

      if (mergedLoaders.every(function (l) {
        return loaderName !== l.match(loaderNameRe)[0];
      })) {
        return [loader].concat(_toConsumableArray(mergedLoaders));
      }
      return mergedLoaders;
    }, foundLoader.loaders);
  } else if (!foundLoader) {
    return [loaderConfig].concat(_toConsumableArray(mergedLoaderConfigs));
  }

  return mergedLoaderConfigs;
}

function joinArrays(a, b, key) {
  if (isArray(a) && isArray(b)) {
    if (key === 'loaders') {
      var ldrs = b.reduce(reduceLoaders, a.slice());
      return ldrs;
    }
    return b.concat(a);
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    return merge(a, b, joinArrays);
  }

  return a;
}

module.exports = function webpackMerge() {
  var args = Array.prototype.slice.call(arguments);
  args.reverse();

  return merge.apply(null, [{}].concat(args).concat([joinArrays]));
};