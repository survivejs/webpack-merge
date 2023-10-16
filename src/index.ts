import wildcard from "wildcard";
import mergeWith from "./merge-with";
import joinArrays from "./join-arrays";
import unique from "./unique";
import {
  CustomizeRule,
  CustomizeRuleString,
  ICustomizeOptions,
  Key,
} from "./types";
import { isPlainObject, isSameCondition, isUndefined } from "./utils";

function merge<Configuration extends object>(
  firstConfiguration: Configuration | Configuration[],
  ...configurations: Configuration[]
): Configuration {
  return mergeWithCustomize<Configuration>({})(
    firstConfiguration,
    ...configurations,
  );
}

function mergeWithCustomize<Configuration extends object>(
  options: ICustomizeOptions,
) {
  return function mergeWithOptions(
    firstConfiguration: Configuration | Configuration[],
    ...configurations: Configuration[]
  ): Configuration {
    if (isUndefined(firstConfiguration) || configurations.some(isUndefined)) {
      throw new TypeError("Merging undefined is not supported");
    }

    // @ts-ignore
    if (firstConfiguration.then) {
      throw new TypeError("Promises are not supported");
    }

    // No configuration at all
    if (!firstConfiguration) {
      return {} as Configuration;
    }

    if (configurations.length === 0) {
      if (Array.isArray(firstConfiguration)) {
        // Empty array
        if (firstConfiguration.length === 0) {
          return {} as Configuration;
        }

        if (firstConfiguration.some(isUndefined)) {
          throw new TypeError("Merging undefined is not supported");
        }

        // @ts-ignore
        if (firstConfiguration[0].then) {
          throw new TypeError("Promises are not supported");
        }

        return mergeWith(
          firstConfiguration,
          joinArrays(options),
        ) as Configuration;
      }

      return firstConfiguration;
    }

    return mergeWith(
      [firstConfiguration].concat(configurations),
      joinArrays(options),
    ) as Configuration;
  };
}

function customizeArray(rules: {
  [s: string]: CustomizeRule | CustomizeRuleString;
}) {
  return (a: any, b: any, key: Key) => {
    const matchedRule =
      Object.keys(rules).find((rule) => wildcard(rule, key)) || "";

    if (matchedRule) {
      switch (rules[matchedRule]) {
        case CustomizeRule.Prepend:
          return [...b, ...a];
        case CustomizeRule.Replace:
          return b;
        case CustomizeRule.Append:
        default:
          return [...a, ...b];
      }
    }
  };
}

type Rules = { [s: string]: CustomizeRule | CustomizeRuleString | Rules };

function mergeWithRules(rules: Rules) {
  return mergeWithCustomize({
    customizeArray: (a: any, b: any, key: Key) => {
      let currentRule: CustomizeRule | CustomizeRuleString | Rules = rules;

      key.split(".").forEach((k) => {
        if (!currentRule) {
          return;
        }

        currentRule = currentRule[k];
      });

      if (isPlainObject(currentRule)) {
        return mergeWithRule({ currentRule, a, b });
      }

      if (typeof currentRule === "string") {
        return mergeIndividualRule({ currentRule, a, b });
      }

      return undefined;
    },
  });
}

const isArray = Array.isArray;

function mergeWithRule({
  currentRule,
  a,
  b,
}: {
  currentRule: CustomizeRule | CustomizeRuleString | Rules;
  a: any;
  b: any;
}) {
  if (!isArray(a)) {
    return a;
  }

  const bAllMatches: any[] = [];
  const ret = a.map((ao) => {
    if (!isPlainObject(currentRule)) {
      return ao;
    }

    const ret = {};
    const rulesToMatch: string[] = [];
    const operations = {};
    Object.entries(currentRule).forEach(([k, v]) => {
      if (v === CustomizeRule.Match) {
        rulesToMatch.push(k);
      } else {
        operations[k] = v;
      }
    });

    const bMatches = b.filter((o) => {
      const matches = rulesToMatch.every((rule) =>
        isSameCondition(ao[rule], o[rule]),
      );

      if (matches) {
        bAllMatches.push(o);
      }

      return matches;
    });

    if (!isPlainObject(ao)) {
      return ao;
    }

    Object.entries(ao).forEach(([k, v]) => {
      const rule = currentRule;

      switch (currentRule[k]) {
        case CustomizeRule.Match:
          ret[k] = v;

          Object.entries(rule).forEach(([k, v]) => {
            if (v === CustomizeRule.Replace && bMatches.length > 0) {
              const val = last(bMatches)[k];

              if (typeof val !== "undefined") {
                ret[k] = val;
              }
            }
          });
          break;
        case CustomizeRule.Append:
          if (!bMatches.length) {
            ret[k] = v;

            break;
          }

          const appendValue = last(bMatches)[k];

          if (!isArray(v) || !isArray(appendValue)) {
            throw new TypeError("Trying to append non-arrays");
          }

          ret[k] = v.concat(appendValue);
          break;
        case CustomizeRule.Merge:
          if (!bMatches.length) {
            ret[k] = v;

            break;
          }

          const lastValue = last(bMatches)[k];

          if (!isPlainObject(v) || !isPlainObject(lastValue)) {
            throw new TypeError("Trying to merge non-objects");
          }

          // deep merge
          ret[k] = merge(v, lastValue);
          break;
        case CustomizeRule.Prepend:
          if (!bMatches.length) {
            ret[k] = v;

            break;
          }

          const prependValue = last(bMatches)[k];

          if (!isArray(v) || !isArray(prependValue)) {
            throw new TypeError("Trying to prepend non-arrays");
          }

          ret[k] = prependValue.concat(v);
          break;
        case CustomizeRule.Replace:
          ret[k] = bMatches.length > 0 ? last(bMatches)[k] : v;
          break;
        default:
          const currentRule = operations[k];

          // Use .flat(); starting from Node 12
          const b = bMatches
            .map((o) => o[k])
            .reduce(
              (acc, val) =>
                isArray(acc) && isArray(val) ? [...acc, ...val] : acc,
              [],
            );

          ret[k] = mergeWithRule({ currentRule, a: v, b });
          break;
      }
    });

    return ret;
  });

  return ret.concat(b.filter((o) => !bAllMatches.includes(o)));
}

function mergeIndividualRule({
  currentRule,
  a,
  b,
}: {
  currentRule: CustomizeRule;
  a: Array<any>;
  b: Array<any>;
}) {
  // What if there's no match?
  switch (currentRule) {
    case CustomizeRule.Append:
      return a.concat(b);
    case CustomizeRule.Prepend:
      return b.concat(a);
    case CustomizeRule.Replace:
      return b;
  }

  return a;
}

function last(arr) {
  return arr[arr.length - 1];
}

function customizeObject(rules: {
  [s: string]: CustomizeRule | CustomizeRuleString;
}) {
  return (a: any, b: any, key: Key) => {
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

export {
  customizeArray,
  customizeObject,
  CustomizeRule,
  merge,
  // This will show up as .default in CommonJS but for TS it's backwards-compatible
  merge as default,
  mergeWithCustomize,
  mergeWithRules,
  unique,
};
