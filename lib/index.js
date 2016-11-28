'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var differenceWith = require('lodash.differencewith');
var mergeWith = require('lodash.mergewith');
var unionWith = require('lodash.unionwith');
var joinArrays = require('./join-arrays');
var uniteRules = require('./unite-rules');

function merge() {
  for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  return mergeWith.apply(undefined, [{}].concat(sources, [joinArrays()]));
}

function mergeSmart() {
  for (var _len2 = arguments.length, sources = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    sources[_key2] = arguments[_key2];
  }

  return mergeWith.apply(undefined, [{}].concat(sources, [joinArrays({
    customizeArray: function customizeArray(a, b, key) {
      if (isRule(key.split('.').slice(-1)[0])) {
        return unionWith(a, b, uniteRules);
      }
    }
  })]));
}

function mergeStrategy() {
  var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // rules: { <field>: <'append'|'prepend'|'replace'> }
  // All default to append but you can override here
  return function () {
    for (var _len3 = arguments.length, sources = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      sources[_key3] = arguments[_key3];
    }

    return mergeWith.apply(undefined, [{}].concat(sources, [joinArrays({
      customizeArray: customizeArray(rules),
      customizeObject: customizeObject(rules)
    })]));
  };
}

function mergeSmartStrategy() {
  var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // rules: { <field>: <'append'|'prepend'|'replace'> }
  // All default to append but you can override here
  var customArray = customizeArray(rules);

  return function () {
    for (var _len4 = arguments.length, sources = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      sources[_key4] = arguments[_key4];
    }

    return mergeWith.apply(undefined, [{}].concat(sources, [joinArrays({
      customizeArray: function customizeArray(a, b, key) {
        if (isRule(key.split('.').slice(-1)[0])) {
          switch (rules[key]) {
            case 'prepend':
              return [].concat(_toConsumableArray(differenceWith(b, a, function (newRule, seenRule) {
                return uniteRules(newRule, seenRule, true);
              })), _toConsumableArray(a));
            case 'replace':
              return b;
            default:
              // append
              return unionWith(a, b, uniteRules);
          }
        }

        return customArray(a, b, key);
      },
      customizeObject: customizeObject(rules)
    })]));
  };
}

function customizeArray(rules) {
  return function (a, b, key) {
    switch (rules[key]) {
      case 'prepend':
        return [].concat(_toConsumableArray(b), _toConsumableArray(a));
      case 'replace':
        return b;
      default:
        // append
        return false;
    }
  };
}

function customizeObject(rules) {
  return function (a, b, key) {
    switch (rules[key]) {
      case 'prepend':
        return mergeWith({}, b, a, joinArrays());
      case 'replace':
        return b;
      default:
        // append
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