import { differenceWith, mergeWith, unionWith, values } from "lodash";
import { Configuration } from "webpack";
import joinArrays from "./join-arrays";
import { uniteRules } from "./join-arrays-smart";
import {
  ArrayRule,
  CustomizeArray,
  CustomizeObject,
  CustomizeRule,
  ICustomizeRules,
  IRule,
  Key
} from "./types";
import unique from "./unique";

export interface IOptions {
  customizeArray?: CustomizeArray;
  customizeObject?: CustomizeObject;
}

// TODO: Test properly and update docs
export function mergeWithOptions(options: IOptions) {
  return (...structures: Configuration[]) =>
    mergeWith({}, ...structures, joinArrays(options));
}

function merge(...options: Configuration[]) {
  if (options.length === 1) {
    if (Array.isArray(options[0])) {
      return mergeWith({}, options[0], joinArrays());
    }

    return options[0];
  }

  return mergeWith({}, ...options, joinArrays());
}

export const smart = mergeWithOptions({
  customizeArray: (a: any, b: any, key: Key) => {
    if (isRule(key.split(".").slice(-1)[0])) {
      return unionWith(a, b, uniteRules.bind(null, {}, key));
    }

    return null;
  }
});

// TODO: Is this needed still?
export const multiple = (...sources: Configuration[]) =>
  values(merge(...sources));

// rules: { <field>: <'append'|'prepend'|'replace'> }
// All default to append but you can override here
export const strategy = (rules: ICustomizeRules = {}) =>
  mergeWithOptions({
    customizeArray: customizeArray(rules),
    customizeObject: customizeObject(rules)
  });
export const mergeSmartStrategy = (rules: ICustomizeRules = {}) =>
  mergeWithOptions({
    customizeArray: (a, b, key: Key) => {
      const topKey = key.split(".").slice(-1)[0];

      if (isRule(topKey)) {
        switch (rules[key]) {
          case "prepend":
            return [
              ...differenceWith(
                b,
                a,
                // TODO: test "prepend" mode
                (newRule: IRule, seenRule: IRule) =>
                  uniteRules(rules, key, newRule, seenRule)
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
  return (a: any, b: any, key: Key) => {
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
  return (a: any, b: any, key: Key) => {
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

function isRule(key: Key) {
  return (
    [
      ArrayRule.PreLoaders,
      ArrayRule.Loaders,
      ArrayRule.PostLoaders,
      ArrayRule.Rules
    ].indexOf(key as ArrayRule) >= 0
  );
}

export default merge;
export { unique };
