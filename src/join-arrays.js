const cloneDeep = require('lodash.clonedeep');
const cloneDeepWith = require('lodash.clonedeepwith');
const isBoolean = require('lodash.isboolean');
const isFunction = require('lodash.isfunction');
const isObject = require('lodash.isobject');
const isNumber = require('lodash.isnumber');
const isPlainObject = require('lodash.isplainobject');
const isString = require('lodash.isstring');
const mergeWith = require('lodash.mergewith');

const isArray = Array.isArray;

module.exports = function joinArrays({ customizeArray, customizeObject, key } = {}) {
  return function _joinArrays(a, b, k) {
    const newKey = key ? `${key}.${k}` : k;

    if (isFunction(a) && isFunction(b)) {
      return (...args) => _joinArrays(a(...args), b(...args), k);
    }

    if (isArray(a) && isArray(b)) {
      const customResult = customizeArray && customizeArray(a, b, newKey);

      return customResult || [...a, ...cloneDeepWith(b, clonePrototype)];
    }

    if (isObject(b)) {
      if (a instanceof b.constructor) {
        if (isPlainObject(b)) {
          const customResult = customizeObject && customizeObject(a, b, newKey);
          return customResult || mergeWith(a, b, joinArrays({
            customizeArray,
            customizeObject,
            key: newKey
          }));
        }
        Object.getOwnPropertyNames(b).forEach((prop) => {
          const customResult = customizeObject && customizeObject(a[prop], b[prop], `${newKey}.${prop}`);
          a[prop] = customResult || mergeWith(a[prop], b[prop], joinArrays({
            customizeArray,
            customizeObject,
            key: `${newKey}.${prop}`
          }));
        });
        return a;
      }
      return cloneDeepWith(b, clonePrototype);
    }

    return b;
  };
};

function clonePrototype(o) {
  if (!isObject(o) || isArray(o) || isBoolean(o) || isNumber(o) || isPlainObject(o) || isString(o)
      || o instanceof RegExp) {
    return;
  }
  if (isFunction(o)) {
    return o;
  }
  const clone = Object.create(Object.getPrototypeOf(o));
  Object.getOwnPropertyNames(o).forEach((prop) => {
    clone[prop] = cloneDeep(o[prop]);
  });
  return clone;
}
