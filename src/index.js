const differenceWith = require('lodash.differencewith');
const mergeWith = require('lodash.mergewith');
const unionWith = require('lodash.unionwith');
const joinArrays = require('./join-arrays');
const joinArraysSmart = require('./join-arrays-smart');

function merge(...sources) {
  // This supports
  // merge([<object>] | ...<object>)
  // merge({ customizeArray: <fn>, customizeObject: <fn>})([<object>] | ...<object>)
  // where fn = (a, b, key)
  if (sources.length === 1) {
    if (Array.isArray(sources[0])) {
      return mergeWith({}, ...sources[0], joinArrays(sources[0]));
    }

    if (sources[0].customizeArray || sources[0].customizeObject) {
      return (...structures) => {
        if (Array.isArray(structures[0])) {
          return mergeWith({}, ...structures[0], joinArrays(sources[0]));
        }

        return mergeWith({}, ...structures, joinArrays(sources[0]));
      };
    }

    return sources[0];
  }

  return mergeWith({}, ...sources, joinArrays());
}

// rules: { <field>: <'append'|'prepend'|'replace'> }
// All default to append but you can override here
const mergeStrategy = (rules = {}) => merge({
  customizeArray: customizeArray(rules),
  customizeObject: customizeObject(rules)
});
const mergeSmartStrategy = (rules = {}) => merge({
  customizeArray: (a, b, key) => {
    const topKey = key.split('.').slice(-1)[0];
    if (isRule(topKey)) {
      const _uniteRules = (aRule, bRule) => joinArraysSmart.uniteRules(aRule, bRule, rules[key]);
      switch (rules[key]) {
        case 'prepend':
          return [...differenceWith(b, a, _uniteRules), ...a];
        case 'replace':
          return b;
        default: // append
          return unionWith(a, b, _uniteRules);
      }
    } else if (topKey === 'plugins') {
      switch (rules[key]) {
        case 'prepend':
          return [...differenceWith(b, a, joinArraysSmart.unitePlugins), ...a];
        case 'replace':
          return b;
        default: // append
          return unionWith(a, b, joinArraysSmart.unitePlugins);
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
module.exports.strategy = mergeStrategy;
module.exports.smart = mergeSmartStrategy();
module.exports.smartStrategy = mergeSmartStrategy;
