/* eslint-env mocha */
const tt = require('typescript-definition-tester');

describe('TypeScript definitions', function () {
  this.timeout(0);

  it('should compile against index.d.ts', (done) => {
    tt.compileDirectory(
      __dirname,
      fileName => fileName.match(/\.ts$/),
      () => done()
    );
  });
});
