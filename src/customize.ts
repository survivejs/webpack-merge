import wildcard from "wildcard";
import mergeWith from "./merge-with";
import joinArrays from "./join-arrays";

interface ICustomizeRules {
  [s: string]: CustomizeRule;
}

enum CustomizeRule {
  Append = "append",
  Prepend = "prepend",
  Replace = "replace",
}

function customizeArray(rules: ICustomizeRules) {
  return (a: any, b: any, key: string) => {
    const match = Object.keys(rules).find((rule) => wildcard(rule, key)) || "";

    switch (rules[match]) {
      case CustomizeRule.Prepend:
        return [...b, ...a];
      case CustomizeRule.Replace:
        return b;
      case CustomizeRule.Append:
      default:
        return [...a, ...b];
    }
  };
}

function customizeObject(rules: ICustomizeRules) {
  return (a: any, b: any, key: string) => {
    switch (rules[key]) {
      case CustomizeRule.Prepend:
        return mergeWith([b, a], joinArrays());
      case CustomizeRule.Replace:
        return b;
      case CustomizeRule.Append:
        return mergeWith([a, b], joinArrays());
    }
  };
}

export { customizeArray, customizeObject };
