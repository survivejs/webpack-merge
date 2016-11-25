const mergeWith = require('lodash.mergewith');
const joinArrays = require('./join-arrays');
const reduceLoaders = require('./reduce-loaders');

function merge(...sources) {
  return mergeWith({}, ...sources, joinArrays());
}

function mergeSmart(...sources) {
  return mergeWith({}, ...sources, joinArrays({
    customizeArray: (a, b, key) => {
      if (isLoader(key.split('.').slice(-1)[0])) {
        return a.reduce(reduceLoaders, b.slice());
      }
    }
  }));
}

function mergeStrategy(rules = {}) {
  // rules: { <field>: <'append'|'prepend'|'replace'> }
  // All default to append but you can override here
  return (...sources) => mergeWith({}, ...sources, joinArrays({
    customizeArray: customizeArray(rules),
    customizeObject: customizeObject(rules)
  }));
}

function mergeSmartStrategy(rules = {}) {
  // rules: { <field>: <'append'|'prepend'> }
  // All default to append but you can override here
  const customArray = customizeArray(rules);

  return (...sources) => mergeWith({}, ...sources, joinArrays({
    customizeArray: (a, b, key) => {
      if (isLoader(key.split('.').slice(-1)[0])) {
        const rule = rules[key];

        switch (rule) {
          case 'prepend':
            return b.reduce(reduceLoaders, a.slice());
          case 'replace':
            return b;
          default:
            return a.reduce(reduceLoaders, b.slice());
        }
      }

      return customArray(a, b, key);
    },
    customizeObject: customizeObject(rules)
  }));
}

function customizeArray(rules) {
  return (a, b, key) => {
    const rule = rules[key];

    switch (rule) {
      case 'prepend':
        return b.concat(a);
      case 'replace':
        return b;
      default:
        return false;
    }
  };
}

function customizeObject(rules) {
  return (a, b, key) => {
    const rule = rules[key];

    switch (rule) {
      case 'prepend':
        return mergeWith({}, b, a, joinArrays());
      case 'replace':
        return b;
      default:
        return false;
    }
  };
}

function isLoader(key) {
  return ['preLoaders', 'loaders', 'postLoaders', 'rules'].indexOf(key) >= 0;
}

module.exports = merge;
module.exports.smart = mergeSmart;
module.exports.strategy = mergeStrategy;
module.exports.smartStrategy = mergeSmartStrategy;
