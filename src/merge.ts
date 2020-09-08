import { Configuration } from "webpack";
import mergeWith from "./merge-with";
import joinArrays, { Customize } from "./join-arrays";

function merge(
  firstConfiguration: Configuration | Configuration[],
  ...configurations: Configuration[]
): Configuration {
  return mergeWithCustomize({})(firstConfiguration, ...configurations);
}

interface ICustomizeOptions {
  customizeArray?: Customize;
  customizeObject?: Customize;
}

function mergeWithCustomize(options: ICustomizeOptions) {
  return function mergeWithOptions(
    firstConfiguration: Configuration | Configuration[],
    ...configurations: Configuration[]
  ): Configuration {
    // No configuration at all
    if (!firstConfiguration) {
      return {};
    }

    // @ts-ignore
    if (firstConfiguration.then) {
      throw new TypeError("Promises are not supported");
    }

    if (configurations.length === 0) {
      if (Array.isArray(firstConfiguration)) {
        // Empty array
        if (firstConfiguration.length === 0) {
          return {};
        }

        // @ts-ignore
        if (firstConfiguration[0].then) {
          throw new TypeError("Promises are not supported");
        }

        return mergeWith(firstConfiguration, joinArrays(options));
      }

      return firstConfiguration;
    }

    return mergeWith(
      [firstConfiguration].concat(configurations),
      joinArrays(options)
    );
  };
}

export { merge, mergeWithCustomize };
