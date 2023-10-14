import { flatten } from "flat";

function isRegex(o) {
  return o instanceof RegExp;
}

// https://stackoverflow.com/a/7356528/228885
function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}

function isPlainObject(a) {
  if (a === null || Array.isArray(a)) {
    return false;
  }

  return typeof a === "object";
}

function isUndefined(a) {
  return typeof a === "undefined";
}

/**
 * According to Webpack docs, a "test" should be the following:
 *
 * - A string
 * - A RegExp
 * - A function
 * - An array of conditions (may be nested)
 * - An object of conditions (may be nested)
 *
 * https://webpack.js.org/configuration/module/#condition
 */
function isSameCondition(a, b) {
  if (!a || !b) {
    return a === b;
  }
  if (
    typeof a === 'string' || typeof b === 'string' ||
    isRegex(a) || isRegex(b) ||
    isFunction(a) || isFunction(b)
  ) {
    return a.toString() === b.toString();
  }

  const entriesA = Object.entries(flatten<any, object>(a));
  const entriesB = Object.entries(flatten<any, object>(b));
  if (entriesA.length !== entriesB.length) {
    return false;
  }

  for (let i = 0; i < entriesA.length; i++) {
    entriesA[i][0] = entriesA[i][0].replace(/\b\d+\b/g, "[]");
    entriesB[i][0] = entriesB[i][0].replace(/\b\d+\b/g, "[]");
  }

  function cmp([k1, v1], [k2, v2]) {
    if (k1 < k2) return -1;
    if (k1 > k2) return 1;
    if (v1 < v2) return -1;
    if (v1 > v2) return 1;
    return 0;
  };
  entriesA.sort(cmp);
  entriesB.sort(cmp);

  if (entriesA.length !== entriesB.length) {
    return false;
  }
  for (let i = 0; i < entriesA.length; i++) {
    if (entriesA[i][0] !== entriesB[i][0] || entriesA[i][1]?.toString() !== entriesB[i][1]?.toString()) {
      return false;
    }
  }
  return true;
}

export { isRegex, isFunction, isPlainObject, isUndefined, isSameCondition };
