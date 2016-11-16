const isPlainObject = require('lodash.isplainobject');
const merge = require('lodash.merge');
const isArray = Array.isArray;

module.exports = function joinArrays(customizer, a, b, key) {
  if (isArray(a) && isArray(b)) {
    const customResult = customizer(a, b, key);

    if (!b.length) {
      return [];
    }

    if (customResult) {
      return customResult;
    }

    return a.concat(b);
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    if (!Object.keys(b).length) {
      return {};
    }

    return merge({}, a, b, joinArrays.bind(null, customizer));
  }

  return b;
};
