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
        if (isLoader(key.split('.').slice(-1)[0])) {
          return a.reduce(reduceLoaders, b.slice());
        }
      }
    })
  ]));
}

function mergeStrategy(rules = {}) {
  // rules: { <field>: <'append'|'prepend'> }
  // All default to append but you can override here
  return function () {
    return lodashMerge.apply(null, [{}].concat(...arguments).concat([
      joinArrays({
        customizeArray: customizeArray(rules),
        customizeObject: customizeObject(rules)
      })
    ]));
  };
}

function mergeSmartStrategy(rules = {}) {
  // rules: { <field>: <'append'|'prepend'> }
  // All default to append but you can override here
  const customArray = customizeArray(rules);

  return function () {
    return lodashMerge.apply(null, [{}].concat(...arguments).concat([
      joinArrays({
        customizeArray: (a, b, key) => {
          if (isLoader(key.split('.').slice(-1)[0])) {
            const rule = rules[key];

            if (rule) {
              if (rule === 'prepend') {
                return b.reduce(reduceLoaders, a.slice());
              }

              if (rule === 'replace') {
                return b;
              }
            }

            return a.reduce(reduceLoaders, b.slice());
          }

          return customArray(a, b, key);
        },
        customizeObject: customizeObject(rules)
      })
    ]));
  };
}

function customizeArray(rules) {
  return (a, b, key) => {
    const rule = rules[key];

    if (rule) {
      if (rule === 'prepend') {
        return b.concat(a);
      }

      if (rule === 'replace') {
        return b;
      }
    }
  };
}

function customizeObject(rules) {
  return (a, b, key) => {
    const rule = rules[key];

    if (rule) {
      if (rule === 'prepend') {
        return lodashMerge({}, b, a, joinArrays());
      }

      if (rule === 'replace') {
        return b;
      }
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
