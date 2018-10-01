/* eslint-env mocha */
const assert = require('assert');

function multipleTests(merge) {
  test('should override objects', () => {
    const a = {
      client: {
        entry: './client.js'
      }
    };
    const b = {
      client: {
        entry: './replaced.js'
      }
    };
    const result = [
      {
        entry: './replaced.js'
      }
    ];

    assert.deepEqual(merge(a, b), result);
  });

  test('should add new objects if not existing', () => {
    const a = {
      client: {
        entry: './client.js'
      },
      server: {
        entry: './server.js'
      }
    };
    const b = {
      client: {
        entry: './replaced.js'
      }
    };
    const result = [
      {
        entry: './replaced.js'
      },
      {
        entry: './server.js'
      }
    ];

    assert.deepEqual(merge(a, b), result);
  });

  test('should add different configurations without merging', () => {
    const a = {
      client: {
        entry: './client.js'
      }
    };
    const b = {
      server: {
        entry: './server.js'
      }
    };
    const result = [
      {
        entry: './client.js'
      },
      {
        entry: './server.js'
      }
    ];

    assert.deepEqual(merge(a, b), result);
  });

  test('should work with an array of objects', () => {
    const a = {
      client: {
        entry: ['./client.js', './client2.js']
      },
      server: {
        entry: ['./server.js', './server2.js']
      }
    };
    const b = {
      client: {
        entry: ['./replaced.js', './replaced2.js']
      }
    };
    const result = [
      {
        entry: ['./client.js', './client2.js', './replaced.js', './replaced2.js']
      },
      {
        entry: ['./server.js', './server2.js']
      }
    ];

    assert.deepEqual(merge(a, b), result);
  });

  test('should deeply merge objects', () => {
    const a = {
      client: {
        entry: {
          main: './client.js'
        }
      },
      server: {
        entry: {
          main: './server.js'
        }
      }
    };
    const b = {
      client: {
        entry: {
          main: './replaced.js'
        }
      }
    };
    const result = [
      {
        entry: {
          main: './replaced.js'
        }
      },
      {
        entry: {
          main: './server.js'
        }
      }
    ];

    assert.deepEqual(merge(a, b), result);
  });

  test('should merge where keys exist and add where not', () => {
    const a = {
      client: {
        entry: './client.js'
      },
      server: {
        entry: './server.js'
      }
    };
    const b = {
      server: {
        entry: './replaced.js'
      },
      test: {
        entry: './test.js'
      }
    };
    const result = [
      {
        entry: './client.js'
      },
      {
        entry: './replaced.js'
      },
      {
        entry: './test.js'
      }
    ];

    assert.deepEqual(merge(a, b), result);
  });
}

module.exports = multipleTests;
