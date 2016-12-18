const differenceWith = require('lodash.differencewith');
const mergeWith = require('lodash.mergewith');
const unionWith = require('lodash.unionwith');
const joinArrays = require('./join-arrays');
const uniteRules = require('./unite-rules');

function merge(...sources) {
  // This supports
  // merge([<object>] | ...<object>)
  // merge({ customizeArray: <fn>, customizeObject: <fn>})([<object>] | ...<object>)
  // where fn = (a, b, key)
  if (sources.length === 1) {
    if (Array.isArray(sources[0])) {
      return mergeWith({}, ...sources[0], joinArrays());
    }

    if (sources[0].customizeArray || sources[0].customizeObject) {
      return (...structures) => {
        if (Array.isArray(structures[0])) {
          return mergeWith({}, ...structures[0], joinArrays(...sources));
        }

        return mergeWith({}, ...structures, joinArrays(...sources));
      };
    }

    return sources[0];
  }

  return mergeWith({}, ...sources, joinArrays());
}

const mergeSmart = merge({
  customizeArray: (a, b, key) => {
    if (isRule(key.split('.').slice(-1)[0])) {
      return unionWith(a, b, uniteRules);
    }

    return null;
  }
});

// rules: { <field>: <'append'|'prepend'|'replace'> }
// All default to append but you can override here
const mergeStrategy = (rules = {}) => merge({
  customizeArray: customizeArray(rules),
  customizeObject: customizeObject(rules)
});
const mergeSmartStrategy = (rules = {}) => merge({
  customizeArray: (a, b, key) => {
    if (isRule(key.split('.').slice(-1)[0])) {
      switch (rules[key]) {
        case 'prepend':
          return [
            ...differenceWith(
              b, a, (newRule, seenRule) => uniteRules(newRule, seenRule, true)
            ),
            ...a
          ];
        case 'replace':
          return b;
        default: // append
          return unionWith(a, b, uniteRules);
      }
    }

    return customizeArray(rules)(a, b, key);
  },
  customizeObject: customizeObject(rules)
});

function customizeArray(rules) {
  return (a, b, key) => {
    switch (rules[key]) {
      case 'prepend':
        return [...b, ...a];
      case 'replace':
        return b;
      default: // append
        return false;
    }
  };
}

function customizeObject(rules) {
  return (a, b, key) => {
    switch (rules[key]) {
      case 'prepend':
        return mergeWith({}, b, a, joinArrays());
      case 'replace':
        return b;
      default: // append
        return false;
    }
  };
}

function isRule(key) {
  return ['preLoaders', 'loaders', 'postLoaders', 'rules'].indexOf(key) >= 0;
}

module.exports = merge;
module.exports.smart = mergeSmart;
module.exports.strategy = mergeStrategy;
module.exports.smartStrategy = mergeSmartStrategy;
