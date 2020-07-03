function mergeUnique(
  key: string,
  uniques: string[],
  getter: (a: object) => string
) {
  return (a: [], b: [], k: string) =>
    k === key && [
      ...a,
      ...difference(b, a, (item) => uniques.indexOf(getter(item)) >= 0),
    ];
}

function difference(a: object[], b: object[], cb: (v: object) => boolean) {
  return a.filter((v, i) => cb(v) !== cb(b[i]));
}

export default mergeUnique;
