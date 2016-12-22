const isEqual = require('lodash.isequal');
const mergeWith = require('lodash.mergewith');
const unionWith = require('lodash.unionwith');
const differenceWith = require('lodash.differencewith');

const isArray = Array.isArray;

module.exports = function uniteRules(newRule, rule, prepend) {
  if (String(rule.test) !== String(newRule.test)
      || (newRule.enforce && rule.enforce !== newRule.enforce)
      || (newRule.include && !isSameValue(rule.include, newRule.include))
      || (newRule.exclude && !isSameValue(rule.exclude, newRule.exclude))) {
    return false;
  }

  // webpack 2 nested rules support
  if (rule.rules) {
    rule.rules = prepend
        ? [
          ...differenceWith(newRule.rules, rule.rules, (b, a) => uniteRules(b, a, true)),
          ...rule.rules
        ]
        : unionWith(rule.rules, newRule.rules, uniteRules);
  }

  // newRule.loader should always override
  if (newRule.loader) {
    const optionsKey = newRule.options ? 'options' : newRule.query && 'query';

    delete rule.use;
    delete rule.loaders;
    rule.loader = newRule.loader;

    if (optionsKey) {
      rule[optionsKey] = newRule[optionsKey];
    }
  } else if ((rule.use || rule.loaders || rule.loader) && (newRule.use || newRule.loaders)) {
    const expandEntry = loader => (
      typeof loader === 'string' ? { loader } : loader
    );
    // this is only here to avoid breaking existing tests
    const unwrapEntry = entry => (
      !entry.options && !entry.query ? entry.loader : entry
    );

    let entries;
    if (rule.loader) {
      const optionsKey = rule.options ? 'options' : rule.query && 'query';
      entries = [{ loader: rule.loader }];

      if (optionsKey) {
        entries[0][optionsKey] = rule[optionsKey];
      }

      delete rule.loader;

      if (optionsKey) {
        delete rule[optionsKey];
      }
    } else {
      entries = [].concat(rule.use || rule.loaders).map(expandEntry);
    }
    const newEntries = [].concat(newRule.use || newRule.loaders).map(expandEntry);

    const loadersKey = rule.use || newRule.use ? 'use' : 'loaders';
    rule[loadersKey] = prepend
        ? [...differenceWith(newEntries, entries, uniteEntries), ...entries].map(unwrapEntry)
        : unionWith(entries, newEntries, uniteEntries).map(unwrapEntry);
  }

  if (newRule.include) {
    rule.include = newRule.include;
  }

  if (newRule.exclude) {
    rule.exclude = newRule.exclude;
  }

  return true;
};

/**
 * Check equality of two values using lodash's isEqual
 * Arrays need to be sorted for equality checking
 * but clone them first so as not to disrupt the sort order in tests
 */
function isSameValue(a, b) {
  const [propA, propB] = [a, b].map(value => (
    isArray(value) ? [...value].sort() : value
  ));

  return isEqual(propA, propB);
}

function uniteEntries(newEntry, entry) {
  const loaderNameRe = /^([^?]+)/ig;

  const [loaderName] = entry.loader.match(loaderNameRe);
  const [newLoaderName] = newEntry.loader.match(loaderNameRe);

  if (loaderName !== newLoaderName) {
    return false;
  }

  // Replace query values with newer ones
  mergeWith(entry, newEntry);
  return true;
}
