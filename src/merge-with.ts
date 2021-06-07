import { isPlainObject } from "./utils";

function mergeWith(objects: object[], customizer) {
  const [first, ...rest] = objects;
  let ret = first;

  rest.forEach((a) => {
    ret = mergeTo(ret, a, customizer);
  });

  return ret;
}

function mergeTo(a, b, customizer) {
  const ret = {};

  console.log(a, b, typeof b, isPlainObject(b));

  if (!isPlainObject(b)) {
    return a;
  }

  Object.keys(a)
    .concat(Object.keys(b))
    .forEach((k) => {
      const v = customizer(a[k], b[k], k);

      /*console.log(
        "merging to",
        k,
        "with value",
        typeof v === "undefined" ? a[k] : v,
        typeof v === "undefined"
      );*/

      ret[k] = typeof v === "undefined" ? a[k] : v;
    });

  return ret;
}

export default mergeWith;
