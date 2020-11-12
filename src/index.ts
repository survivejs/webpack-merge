import wildcard from "wildcard";
import mergeWith from "./merge-with";
import joinArrays from "./join-arrays";
import unique from "./unique";
import { CustomizeRule, ICustomizeOptions, Key } from "./types";
import { isPlainObject, isUndefined } from "./utils";

function merge<Configuration extends object>(
  firstConfiguration: Configuration | Configuration[],
  ...configurations: Configuration[]
): Configuration {
  return mergeWithCustomize<Configuration>({})(
    firstConfiguration,
    ...configurations
  );
}

function mergeWithCustomize<Configuration extends object>(
  options: ICustomizeOptions
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
          joinArrays(options)
        ) as Configuration;
      }

      return firstConfiguration;
    }

    return mergeWith(
      [firstConfiguration].concat(configurations),
      joinArrays(options)
    ) as Configuration;
  };
}

function customizeArray(rules: { [s: string]: CustomizeRule }) {
  return (a: any, b: any, key: Key) => {
    const matchedRule =
      Object.keys(rules).find(rule => wildcard(rule, key)) || "";

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

type Rules = { [s: string]: CustomizeRule | Rules };

function mergeWithRules(rules: Rules) {
  return mergeWithCustomize({
    customizeArray: (a: any, b: any, key: Key) => {
      let currentRule: CustomizeRule | Rules = rules;

      key.split(".").forEach(k => {
        if (!currentRule) {
          return;
        }

        currentRule = currentRule[k];
      });

      if (isPlainObject(currentRule)) {
        return mergeWithRule({ currentRule, a, b });
      }

      return undefined;
    }
  });
}

const isArray = Array.isArray;

function mergeWithRule({
  currentRule,
  a,
  b
}: {
  currentRule: CustomizeRule | Rules;
  a: any;
  b: any;
}) {
  if (!isArray(a)) {
    return a;
  }

  const bAllMatches: any[] = [];
  const ret = a.map(ao => {
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

    const bMatches = b.filter(o => {
      const matches = rulesToMatch.every(
        rule => ao[rule]?.toString() === o[rule]?.toString()
      );

      if (matches) {
        bAllMatches.push(o);
      }

      return matches;
    });

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
          ret[k] =
            bMatches.length > 0
              ? (v as Array<any>).concat(last(bMatches)[k])
              : v;
          break;
        case CustomizeRule.Prepend:
          ret[k] = bMatches.length > 0 ? last(bMatches)[k].concat(v) : v;
          break;
        case CustomizeRule.Replace:
          ret[k] = bMatches.length > 0 ? last(bMatches)[k] : v;
          break;
        default:
          const currentRule = operations[k];

          // Use .flat(); starting from Node 12
          const b = bMatches
            .map(o => o[k])
            .reduce(
              (acc, val) =>
                isArray(acc) && isArray(val) ? [...acc, ...val] : acc,
              []
            );

          ret[k] = mergeWithRule({ currentRule, a: v, b });
          break;
      }
    });

    return ret;
  });

  return ret.concat(b.filter(o => !bAllMatches.includes(o)));
}

function last(arr) {
  return arr[arr.length - 1];
}

function customizeObject(rules: { [s: string]: CustomizeRule }) {
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
  unique
};
