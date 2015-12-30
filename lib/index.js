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
        // prepend because of rtl (latter objects should be able to build the chain)
        return [].concat(_toConsumableArray(mergedLoaders), [loader]);
      }
      return mergedLoaders;
    }, foundLoader.loaders);
  } else if (!foundLoader) {
    return [loaderConfig].concat(_toConsumableArray(mergedLoaderConfigs));
  }

  return mergedLoaderConfigs;
}

function joinArrays(customizer, a, b, key) {
  if (isArray(a) && isArray(b)) {
    var customResult = customizer(a, b, key);

    if (customResult) {
      return customResult;
    }

    return b.concat(a);
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    return merge(a, b, joinArrays.bind(null, function () {}));
  }

  return a;
}

module.exports = function () {
  var args = Array.prototype.slice.call(arguments);
  args.reverse();

  return merge.apply(null, [{}].concat(args).concat([joinArrays.bind(null, function () {})]));
};

module.exports.smart = function webpackMerge() {
  var args = Array.prototype.slice.call(arguments);
  args.reverse();

  return merge.apply(null, [{}].concat(args).concat([joinArrays.bind(null, function (a, b, key) {
    if (['loaders', 'preLoaders', 'postLoaders'].indexOf(key) >= 0) {
      return b.reduce(reduceLoaders, a.slice());
    }
  })]));
};