function mergeUnique(
  key: string,
  uniques: string[],
  getter: (a: object) => string
) {
  return (a: [], b: [], k: string) =>
    k === key && [
      ...a,
      ...difference(b, a, (item) => uniques.indexOf(getter(item))),
    ];
}

function difference(a: object[], b: object[], cb: (v: object) => number) {
  return a.filter((v, i) => {
    const foundA = cb(v);
    const foundB = cb(b[i]);

    if (foundA >= 0 && foundB >= 0) {
      return foundA !== foundB;
    }

    return true;
  });
}

export default mergeUnique;
