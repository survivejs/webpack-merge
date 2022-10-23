import assert from "assert";

function multipleTests(merge) {
  it("should override objects", function () {
    const a = {
      client: {
        entry: "./client.js",
      },
    };
    const b = {
      client: {
        entry: "./replaced.js",
      },
    };
    const result = [
      {
        entry: "./replaced.js",
      },
    ];

    assert.deepStrictEqual(merge(a, b), result);
  });

  it("should add new objects if not existing", function () {
    const a = {
      client: {
        entry: "./client.js",
      },
      server: {
        entry: "./server.js",
      },
    };
    const b = {
      client: {
        entry: "./replaced.js",
      },
    };
    const result = [
      {
        entry: "./replaced.js",
      },
      {
        entry: "./server.js",
      },
    ];

    assert.deepStrictEqual(merge(a, b), result);
  });

  it("should add different configurations without merging", function () {
    const a = {
      client: {
        entry: "./client.js",
      },
    };
    const b = {
      server: {
        entry: "./server.js",
      },
    };
    const result = [
      {
        entry: "./client.js",
      },
      {
        entry: "./server.js",
      },
    ];

    assert.deepStrictEqual(merge(a, b), result);
  });

  it("should work with an array of objects", function () {
    const a = {
      client: {
        entry: ["./client.js", "./client2.js"],
      },
      server: {
        entry: ["./server.js", "./server2.js"],
      },
    };
    const b = {
      client: {
        entry: ["./replaced.js", "./replaced2.js"],
      },
    };
    const result = [
      {
        entry: [
          "./client.js",
          "./client2.js",
          "./replaced.js",
          "./replaced2.js",
        ],
      },
      {
        entry: ["./server.js", "./server2.js"],
      },
    ];

    assert.deepStrictEqual(merge(a, b), result);
  });

  it("should deeply merge objects", function () {
    const a = {
      client: {
        entry: {
          main: "./client.js",
        },
      },
      server: {
        entry: {
          main: "./server.js",
        },
      },
    };
    const b = {
      client: {
        entry: {
          main: "./replaced.js",
        },
      },
    };
    const result = [
      {
        entry: {
          main: "./replaced.js",
        },
      },
      {
        entry: {
          main: "./server.js",
        },
      },
    ];

    assert.deepStrictEqual(merge(a, b), result);
  });

  it("should merge where keys exist and add where not", function () {
    const a = {
      client: {
        entry: "./client.js",
      },
      server: {
        entry: "./server.js",
      },
    };
    const b = {
      server: {
        entry: "./replaced.js",
      },
      test: {
        entry: "./test.js",
      },
    };
    const result = [
      {
        entry: "./client.js",
      },
      {
        entry: "./replaced.js",
      },
      {
        entry: "./test.js",
      },
    ];

    assert.deepStrictEqual(merge(a, b), result);
  });
}

export default multipleTests;
