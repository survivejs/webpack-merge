const lodashMerge = require('lodash.merge');
const joinArrays = require('./join-arrays');
const reduceLoaders = require('./reduce-loaders');

function merge() {
  return lodashMerge.apply(null, [{}].concat(...arguments).concat([
    joinArrays.bind(null, () => {})
  ]));
}

function mergeSmart() {
  return lodashMerge.apply(null, [{}].concat(...arguments).concat([
    joinArrays.bind(null, function (a, b, key) {
      if (isLoader(key)) {
        return a.reduce(reduceLoaders, b.slice());
      }
    })
  ]));
}

function mergeStrategy() {
  return merge(...arguments);
}

function isLoader(key) {
  return ['preLoaders', 'loaders', 'postLoaders', 'rules'].indexOf(key) >= 0;
}

module.exports = merge;
module.exports.smart = mergeSmart;
module.exports.strategy = mergeStrategy;
