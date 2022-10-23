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

export { isRegex, isFunction, isPlainObject, isUndefined };
