const find = require('lodash.find');
const isEqual = require('lodash.isequal');
const isArray = Array.isArray;

module.exports = function reduceLoaders(mergedLoaderConfigs, loaderConfig) {
  const foundLoader = find(mergedLoaderConfigs, (l) => {
    return String(l.test) === String(loaderConfig.test)
        && (!l.include || isSameValue(l.include, loaderConfig.include))
        && (!l.exclude || isSameValue(l.exclude, loaderConfig.exclude));
  });

  if (foundLoader) {
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

  return [loaderConfig, ...mergedLoaderConfigs];
};

/**
 * Check equality of two values using lodash's isEqual
 * Arrays need to be sorted for equality checking
 * but clone them first so as not to disrupt the sort order in tests
 */
function isSameValue(a, b) {
  const [propA, propB] = [a, b].map(value => isArray(value) ? [...value].sort() : value);

  return isEqual(propA, propB);
}

function mergeLoaders(currentLoaders, newLoaders) {
  const loaderNameRe = /^([^\?]+)/ig;

  return newLoaders.reduce((mergedLoaders, loader) => {
    if (mergedLoaders.every(l => loader.match(loaderNameRe)[0] !== l.match(loaderNameRe)[0])) {
      return mergedLoaders.concat([loader]);
    }

    // Replace query values with newer ones
    return mergedLoaders.map(l => loader.match(loaderNameRe)[0] === l.match(loaderNameRe)[0] ? loader : l);
  }, currentLoaders);
}
