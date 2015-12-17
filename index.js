var isArray = Array.isArray;
var isPlainObject = require('lodash.isplainobject');
var merge = require('lodash.merge');

module.exports = function() {
  var args = Array.prototype.slice.call(arguments);
  args.reverse();

  return merge.apply(null, [{}].concat(args).concat([joinArrays]));
};

function joinArrays(a, b, key) {
  if(isArray(a) && isArray(b)) {
    if(key === 'loaders') {
      var ldrs = b.reduce(reduceLoaders, a.slice());
      return ldrs;
    }
    return b.concat(a);
  }

  if(isPlainObject(a) && isPlainObject(b)) {
    return merge(a, b, joinArrays);
  }

  return a;
}

function reduceLoaders(mergedLoaders, loader) {
  function isSimilarLoader(l) {
    return String(l.test) === String(loader.test);
  };
  if (!mergedLoaders.some(isSimilarLoader)) {
    mergedLoaders.push(loader);
  }
  return mergedLoaders;
}

