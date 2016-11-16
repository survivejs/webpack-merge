const lodashMerge = require('lodash.merge');
const joinArrays = require('./join-arrays');
const reduceLoaders = require('./reduce-loaders');

function merge() {
  return lodashMerge.apply(null, [{}].concat(...arguments).concat([
    joinArrays()
  ]));
}

function mergeSmart() {
  return lodashMerge.apply(null, [{}].concat(...arguments).concat([
    joinArrays({
      customizeArray: (a, b, key) => {
        if (isLoader(key)) {
          return a.reduce(reduceLoaders, b.slice());
        }
      }
    })
  ]));
}

function mergeStrategy(rules = {}) {
  // rules: { <field>: 'append': 'prepend' }
  // All default to append but you can override here
  return function () {
    return lodashMerge.apply(null, [{}].concat(...arguments).concat([
      joinArrays() // TODO: connect rules with customizers
    ]));
  };
}

function isLoader(key) {
  return ['preLoaders', 'loaders', 'postLoaders', 'rules'].indexOf(key) >= 0;
}

module.exports = merge;
module.exports.smart = mergeSmart;
module.exports.strategy = mergeStrategy;
