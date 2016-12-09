const differenceWith = require('lodash.differencewith');
const mergeWith = require('lodash.mergewith');
const unionWith = require('lodash.unionwith');
const joinArrays = require('./join-arrays');
const uniteRules = require('./unite-rules');

function merge(...sources) {
  if (sources.length === 1) {
    return (...structures) => mergeWith({}, ...structures, joinArrays(...sources));
  }

  return mergeWith({}, ...sources, joinArrays());
}

function mergeSmart(...sources) {
  return mergeWith({}, ...sources, joinArrays({
    customizeArray: (a, b, key) => {
      if (isRule(key.split('.').slice(-1)[0])) {
        return unionWith(a, b, uniteRules);
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
  // rules: { <field>: <'append'|'prepend'|'replace'> }
  // All default to append but you can override here
  const customArray = customizeArray(rules);

  return (...sources) => mergeWith({}, ...sources, joinArrays({
    customizeArray: (a, b, key) => {
      if (isRule(key.split('.').slice(-1)[0])) {
        switch (rules[key]) {
          case 'prepend':
            return [...differenceWith(b, a, (newRule, seenRule) => uniteRules(newRule, seenRule, true)), ...a];
          case 'replace':
            return b;
          default: // append
            return unionWith(a, b, uniteRules);
        }
      }

      return customArray(a, b, key);
    },
    customizeObject: customizeObject(rules)
  }));
}

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
