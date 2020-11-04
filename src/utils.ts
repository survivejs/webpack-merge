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
  if (a === null) {
    return false;
  }

  return typeof a === "object";
}

function isUndefined(a) {
  return typeof a === "undefined";
}

function isString(a) {
  return typeof a === "string";
}

export { isRegex, isFunction, isPlainObject, isString, isUndefined };
