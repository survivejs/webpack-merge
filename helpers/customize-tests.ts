import assert from "assert";

function mergeStrategyTests(merge) {
  it("should allow setting to array append", function () {
    const a = {
      entry: ["foo", "bar", "baz"],
    };
    const b = {
      entry: ["zoo"],
    };
    const result = {
      entry: ["foo", "bar", "baz", "zoo"],
    };

    assert.deepStrictEqual(
      merge({
        entry: "append",
      })(a, b),
      result
    );
  });

  it("should allow setting to array prepend", function () {
    const a = {
      entry: ["foo", "bar", "baz"],
    };
    const b = {
      entry: ["zoo"],
    };
    const result = {
      entry: ["zoo", "foo", "bar", "baz"],
    };

    assert.deepStrictEqual(
      merge({
        entry: "prepend",
      })(a, b),
      result
    );
  });

  it("should allow setting to object append", function () {
    const a = {
      entry: {
        foo: "bar",
      },
    };
    const b = {
      entry: {
        bar: "baz",
      },
    };
    const result = {
      entry: {
        foo: "bar",
        bar: "baz",
      },
    };

    assert.deepStrictEqual(
      Object.keys(
        merge({
          entry: "append",
        })(a, b).entry
      ),
      Object.keys(result.entry)
    );
  });

  it("should allow setting to object prepend", function () {
    const a = {
      entry: {
        foo: "bar",
      },
    };
    const b = {
      entry: {
        bar: "baz",
      },
    };
    const result = {
      entry: {
        bar: "baz",
        foo: "bar",
      },
    };

    assert.deepStrictEqual(
      Object.keys(
        merge({
          entry: "prepend",
        })(a, b).entry
      ),
      Object.keys(result.entry)
    );
  });

  it("should allow replace strategy for arrays", function () {
    const a = {
      entry: ["foo"],
    };
    const b = {
      entry: ["bar"],
    };
    const result = {
      entry: ["bar"],
    };

    assert.deepStrictEqual(
      Object.keys(
        merge({
          entry: "replace",
        })(a, b).entry
      ),
      Object.keys(result.entry)
    );
  });

  it("should allow replace strategy for objects", function () {
    const a = {
      entry: {
        foo: "bar",
      },
    };
    const b = {
      entry: {
        bar: "baz",
      },
    };
    const result = {
      entry: {
        bar: "baz",
      },
    };

    assert.deepStrictEqual(
      Object.keys(
        merge({
          entry: "replace",
        })(a, b).entry
      ),
      Object.keys(result.entry)
    );
  });

  it("should merge functions returning arrays with prepend", function () {
    const a = {
      postcss() {
        return ["a"];
      },
    };
    const b = {
      postcss() {
        return ["b"];
      },
    };
    const expected = ["b", "a"];

    assert.deepStrictEqual(
      merge({
        postcss: "prepend",
      })(a, b).postcss(),
      expected
    );
  });

  it("should merge functions returning objects with prepend", function () {
    const a = {
      postcss() {
        return {
          a: "foo",
        };
      },
    };
    const b = {
      postcss() {
        return {
          b: "bar",
        };
      },
    };
    const result = {
      postcss() {
        return {
          b: "bar",
          a: "foo",
        };
      },
    };

    assert.deepStrictEqual(
      Object.keys(
        merge({
          postcss: "prepend",
        })(a, b).postcss()
      ),
      Object.keys(result.postcss())
    );
  });

  it("should merge functions returning arrays with replace", function () {
    const a = {
      postcss() {
        return ["a"];
      },
    };
    const b = {
      postcss() {
        return ["b"];
      },
    };
    const expected = ["b"];

    assert.deepStrictEqual(
      merge({
        postcss: "replace",
      })(a, b).postcss(),
      expected
    );
  });

  it("should merge functions returning objects with replace", function () {
    const a = {
      postcss() {
        return ["a"];
      },
    };
    const b = {
      postcss() {
        return ["b"];
      },
    };
    const expected = ["b"];

    assert.deepStrictEqual(
      merge({
        postcss: "replace",
      })(a, b).postcss(),
      expected
    );
  });
}

export default mergeStrategyTests;
