import { differenceWith, isEqual, mergeWith, unionWith } from "lodash";
import { CustomizeRule, ICustomizeRules, ILoader, IRule, Key } from "./types";

const isArray = Array.isArray;

function uniteRules(
  rules: ICustomizeRules,
  key: Key,
  newRule: IRule,
  rule: IRule
) {
  if (
    String(rule.test) !== String(newRule.test) ||
    ((newRule.enforce || rule.enforce) && rule.enforce !== newRule.enforce) ||
    (newRule.include && !isSameValue(rule.include, newRule.include)) ||
    (newRule.exclude && !isSameValue(rule.exclude, newRule.exclude))
  ) {
    return false;
  } else if (
    !rule.test &&
    !rule.include &&
    !rule.exclude &&
    (rule.loader && rule.loader.split("?")[0]) !==
      (newRule.loader && newRule.loader.split("?")[0])
  ) {
    // Don't merge the rule if there isn't any identifying fields and the loaders don't match
    return false;
  } else if (
    (rule.include || rule.exclude) &&
    (!newRule.include && !newRule.exclude)
  ) {
    // Don't merge child without include/exclude to parent that has either
    return false;
  }

  // apply the same logic for oneOf
  if (rule.oneOf && newRule.oneOf) {
    rule.oneOf = unionWith(
      rule.oneOf,
      newRule.oneOf,
      uniteRules.bind(null, {}, "oneOf")
    );

    return true;
  }

  // newRule.loader should always override use, loaders and oneOf
  if (newRule.loader) {
    const optionsKey = newRule.options ? "options" : newRule.query && "query";

    delete rule.use;
    delete rule.loaders;
    delete rule.oneOf;

    rule.loader = newRule.loader;

    if (optionsKey) {
      rule[optionsKey] = newRule[optionsKey];
    }
  } else if (newRule.oneOf) {
    delete rule.use;
    delete rule.loaders;
    delete rule.loader;

    rule.oneOf = newRule.oneOf;
  } else if (
    (rule.use || rule.loaders || rule.loader) &&
    (newRule.use || newRule.loaders)
  ) {
    const expandEntry = (loader: ILoader | string) =>
      typeof loader === "string" ? { loader } : loader;
    // this is only here to avoid breaking existing tests
    const unwrapEntry = (entry: ILoader) =>
      !entry.options && !entry.query ? entry.loader : entry;

    let entries: ILoader[];
    if (rule.loader) {
      const optionsKey = rule.options ? "options" : rule.query && "query";
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
    const newEntries = []
      .concat(newRule.use || newRule.loaders)
      .map(expandEntry);

    const loadersKey = rule.use || newRule.use ? "use" : "loaders";
    const resolvedKey = `${key}.${loadersKey}`;

    switch (rules[resolvedKey]) {
      case CustomizeRule.Prepend:
        rule[loadersKey] = [
          ...differenceWith(newEntries, entries, uniteEntries),
          ...entries
        ].map(unwrapEntry);
        break;
      case CustomizeRule.Replace:
        rule[loadersKey] = newRule.use || newRule.loaders;
        break;
      case CustomizeRule.Append:
      default:
        rule[loadersKey] = combineEntries(newEntries, entries).map(unwrapEntry);
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
function isSameValue(a: any, b: any) {
  const [propA, propB] = [a, b].map(
    value => (isArray(value) ? [...value].sort() : value)
  );

  return isEqual(propA, propB);
}

function areEqualEntries(newEntry: ILoader, entry: ILoader) {
  const loaderNameRe = /^([^?]+)/gi;

  return isEqual(
    entry.loader.match(loaderNameRe),
    newEntry.loader.match(loaderNameRe)
  );
}

function uniteEntries(newEntry: ILoader, entry: ILoader) {
  if (areEqualEntries(newEntry, entry)) {
    // Replace query values with newer ones
    mergeWith(entry, newEntry);
    return true;
  }
  return false;
}

/* Combines entries and newEntries, while respecting the order of loaders in each.

Iterates through new entries. If the new entry also exists in existing entries,
we'll put in all of the loaders from existing entries that come before it (in case
those are pre-requisites). Any remaining existing entries are added at the end.

Since webpack processes right-to-left, we're working backwards through the arrays
*/
function combineEntries(newEntries: ILoader[], existingEntries: ILoader[]) {
  const resultSet = [];

  // We're iterating through newEntries, this keeps track of where we are in the existingEntries
  let existingEntriesIteratorIndex = existingEntries.length - 1;

  for (let i = newEntries.length - 1; i >= 0; i -= 1) {
    const currentEntry = newEntries[i];
    const indexInExistingEntries = findLastIndexUsingComparinator(
      existingEntries,
      currentEntry,
      existingEntriesIteratorIndex
    );
    const hasEquivalentEntryInExistingEntries = indexInExistingEntries !== -1;

    if (hasEquivalentEntryInExistingEntries) {
      // If the same entry exists in existing entries, we should add all of the entries that
      // come before to maintain order
      for (
        let j = existingEntriesIteratorIndex;
        j > indexInExistingEntries;
        j -= 1
      ) {
        const existingEntry = existingEntries[j];

        // If this entry also exists in new entries, we'll add as part of iterating through
        // new entries so that if there's a conflict between existing entries and new entries,
        // new entries order wins
        const hasMatchingEntryInNewEntries =
          findLastIndexUsingComparinator(newEntries, existingEntry, i) !== -1;

        if (!hasMatchingEntryInNewEntries) {
          resultSet.unshift(existingEntry);
        }
        existingEntriesIteratorIndex -= 1;
      }

      uniteEntries(currentEntry, existingEntries[existingEntriesIteratorIndex]);
      // uniteEntries mutates the second parameter to be a merged version, so that's what's pushed
      resultSet.unshift(existingEntries[existingEntriesIteratorIndex]);

      existingEntriesIteratorIndex -= 1;
    } else {
      const alreadyHasMatchingEntryInResultSet =
        findLastIndexUsingComparinator(
          resultSet,
          currentEntry,
          resultSet.length - 1
        ) !== -1;

      if (!alreadyHasMatchingEntryInResultSet) {
        resultSet.unshift(currentEntry);
      }
    }
  }

  // Add remaining existing entries
  for (
    existingEntriesIteratorIndex;
    existingEntriesIteratorIndex >= 0;
    existingEntriesIteratorIndex -= 1
  ) {
    const existingEntry = existingEntries[existingEntriesIteratorIndex];
    const alreadyHasMatchingEntryInResultSet =
      findLastIndexUsingComparinator(
        resultSet,
        existingEntry,
        resultSet.length - 1
      ) !== -1;

    if (!alreadyHasMatchingEntryInResultSet) {
      resultSet.unshift(existingEntry);
    }
  }

  return resultSet;
}

function findLastIndexUsingComparinator(
  entries: ILoader[],
  entryToFind: ILoader,
  startingIndex: number
) {
  for (let i = startingIndex; i >= 0; i -= 1) {
    if (areEqualEntries(entryToFind, entries[i])) {
      return i;
    }
  }
  return -1;
}

export { uniteRules, uniteEntries };
