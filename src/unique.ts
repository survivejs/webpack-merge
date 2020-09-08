function mergeUnique(
  key: string,
  uniques: string[],
  getter: (a: object) => string
) {
  return (a: [], b: [], k: string) =>
    k === key &&
    Array.isArray(uniques) && [
      ...difference(a, b, (item) => uniques.indexOf(getter(item))),
      ...b,
    ];
}

function difference(a: object[], b: object[], cb: (v: object) => number) {
  const ret = a.filter((v, i) => {
    const foundA = cb(v);
    const foundB = cb(b[i] || {});

    if (foundA >= 0 && foundB >= 0) {
      return foundA !== foundB;
    }

    return true;
  });

  return ret;
}

export default mergeUnique;
