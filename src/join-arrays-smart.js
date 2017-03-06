import {
  isEqual, mergeWith, unionWith, differenceWith
} from 'lodash';

const isArray = Array.isArray;

function uniteRules(rules, key, newRule, rule) {
  if (String(rule.test) !== String(newRule.test)
      || ((newRule.enforce || rule.enforce) && rule.enforce !== newRule.enforce)
      || (newRule.include && !isSameValue(rule.include, newRule.include))
      || (newRule.exclude && !isSameValue(rule.exclude, newRule.exclude))) {
    return false;
  } else if (!rule.test && !rule.include && !rule.exclude
      && (rule.loader && rule.loader.split('?')[0]) !== (newRule.loader && newRule.loader.split('?')[0])) {
    // Don't merge the rule if there isn't any identifying fields and the loaders don't match
    return false;
  } else if ((rule.include || rule.exclude) && (!newRule.include && !newRule.exclude)) {
    // Don't merge child without include/exclude to parent that has either
    return false;
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
    const resolvedKey = `${key}.${loadersKey}`;

    switch (rules[resolvedKey]) {
      case 'prepend':
        rule[loadersKey] = [
          ...differenceWith(newEntries, entries, uniteEntries),
          ...entries
        ].map(unwrapEntry);
        break;
      case 'replace':
        rule[loadersKey] = newRule.use || newRule.loaders;
        break;
      default:
        rule[loadersKey] = unionWith(
          // Remove existing entries so that we can respect the order of the new
          // entries
          differenceWith(entries, newEntries, isEqual),
          newEntries,
          uniteEntries
        ).map(unwrapEntry);
    }
  }

  if (newRule.include) {
    rule.include = newRule.include;
  }

  if (newRule.exclude) {
    rule.exclude = newRule.exclude;
  }

  return true;
}

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

export {
  uniteRules,
  uniteEntries
};
