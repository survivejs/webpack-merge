import { differenceWith, mergeWith, unionWith, values } from "lodash";
import joinArrays from "./join-arrays";
import { uniteRules } from "./join-arrays-smart";
import {
  ArrayRule,
  Configuration,
  CustomizeRule,
  ICustomizeRules,
  Key
} from "./types";
import unique from "./unique";

function merge(...sources: Configuration[]) {
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

export const smart = merge({
  customizeArray: (a: any, b: any, key: Key) => {
    if (isRule(key.split(".").slice(-1)[0])) {
      return unionWith(a, b, uniteRules.bind(null, {}, key));
    }

    return null;
  }
});

export const multiple = (...sources: Configuration[]) => values(merge(sources));

// rules: { <field>: <'append'|'prepend'|'replace'> }
// All default to append but you can override here
export const strategy = (rules: ICustomizeRules = {}) =>
  merge({
    customizeArray: customizeArray(rules),
    customizeObject: customizeObject(rules)
  });
const mergeSmartStrategy = (rules = {}) =>
  merge({
    customizeArray: (a, b, key: Key) => {
      const topKey = key.split(".").slice(-1)[0];

      if (isRule(topKey)) {
        switch (rules[key]) {
          case "prepend":
            return [
              ...differenceWith(b, a, (newRule, seenRule) =>
                uniteRules(rules, key, newRule, seenRule, "prepend")
              ),
              ...a
            ];
          case "replace":
            return b;
          default:
            // append
            return unionWith(a, b, uniteRules.bind(null, rules, key));
        }
      }

      return customizeArray(rules)(a, b, key);
    },
    customizeObject: customizeObject(rules)
  });

function customizeArray(rules: ICustomizeRules) {
  return (a: any, b: any, key: CustomizeRule) => {
    switch (rules[key]) {
      case CustomizeRule.Prepend:
        return [...b, ...a];
      case CustomizeRule.Replace:
        return b;
      case CustomizeRule.Append:
      default:
        // append
        return false;
    }
  };
}

function customizeObject(rules: ICustomizeRules) {
  return (a: any, b: any, key: CustomizeRule) => {
    switch (rules[key]) {
      case CustomizeRule.Prepend:
        return mergeWith({}, b, a, joinArrays());
      case CustomizeRule.Replace:
        return b;
      case CustomizeRule.Append:
      default:
        return false;
    }
  };
}

function isRule(key: ArrayRule) {
  return (
    [
      ArrayRule.PreLoaders,
      ArrayRule.Loaders,
      ArrayRule.PostLoaders,
      ArrayRule.Rules
    ].indexOf(key) >= 0
  );
}

export default merge;
export { unique };
