declare module 'webpack-merge' {
  import { Configuration } from 'webpack';
  function merge(...args: Configuration[]): Configuration;

  export = merge;
}
