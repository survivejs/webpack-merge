const find = require('lodash.find');
const isEqual = require('lodash.isequal');
const isArray = Array.isArray;

module.exports = function reduceLoaders(mergedLoaderConfigs, loaderConfig) {
  const foundLoader = find(
    mergedLoaderConfigs,
    l => String(l.test) === String(loaderConfig.test)
  );

  if (foundLoader) {
    /**
     * When both loaders have different `include` or `exclude`
     * properties, concat them
     */
    if ((foundLoader.include && !isSameValue(foundLoader.include, loaderConfig.include)) ||
        (foundLoader.exclude && !isSameValue(foundLoader.exclude, loaderConfig.exclude))) {
      return [loaderConfig].concat(mergedLoaderConfigs);
    }

    // foundLoader.loader is intentionally ignored, because a string loader value should always override
    if (foundLoader.loaders) {
      const newLoaders = loaderConfig.loader ? [loaderConfig.loader] : loaderConfig.loaders || [];

      foundLoader.loaders = mergeLoaders(newLoaders, foundLoader.loaders);
    }

    // webpack 2 support
    if (foundLoader.rules) {
      const newRules = loaderConfig.loader ? [loaderConfig.loader] : loaderConfig.rules || [];

      foundLoader.rules = mergeLoaders(newRules, foundLoader.rules);
    }

    if (loaderConfig.include) {
      foundLoader.include = loaderConfig.include;
    }

    if (loaderConfig.exclude) {
      foundLoader.exclude = loaderConfig.exclude;
    }

    return mergedLoaderConfigs;
  }

  return [loaderConfig].concat(mergedLoaderConfigs);
};

/**
 * Check equality of two values using lodash's isEqual
 * Arrays need to be sorted for equality checking
 * but clone them first so as not to disrupt the sort order in tests
 */
function isSameValue(a, b) {
  const [propA, propB] = [a, b].map(function (value) {
    return isArray(value) ? value.slice().sort() : value;
  });

  return isEqual(propA, propB);
}

function mergeLoaders(currentLoaders, newLoaders) {
  const loaderNameRe = /^([^\?]+)/ig;

  return newLoaders.reduce((mergedLoaders, loader) => {
    if (mergedLoaders.every(
      l => loader.match(loaderNameRe)[0] !== l.match(loaderNameRe)[0])
    ) {
      return mergedLoaders.concat([loader]);
    }

    // Replace query values with newer ones
    return mergedLoaders.map(l => {
      if (loader.match(loaderNameRe)[0] === l.match(loaderNameRe)[0]) {
        return loader;
      }

      return l;
    });
  }, currentLoaders);
}
