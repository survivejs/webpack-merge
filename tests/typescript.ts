import * as webpackMerge from ".."
import * as webpack from "webpack";
import { Configuration } from "webpack";

// fixtures
const a: Configuration = {
  entry: "test.js"
}
const b: Configuration = {
  devtool: "source-map"
}
const ab = [a, b]

const bogusCustomizer: webpackMerge.CustomizationObj = {
  customizeArray(a, b, key) {
    return undefined;
  },
  customizeObject(a, b, key) {
    return undefined;
  }
}

// Default API
var output = webpackMerge(a, b);
var output = webpackMerge(ab);
// var output = webpackMerge(a, ab); // NOTE: just for example, this should not compile

// Customizing array/object behavior
var output = webpackMerge(bogusCustomizer)(a, b);

// unique
var output = webpackMerge({
  customizeArray: webpackMerge.unique(
    'plugins',
    ['HotModuleReplacementPlugin'],
    plugin => plugin.constructor && plugin.constructor.name
  )
})({
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}, {
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});

// strategy
var output = webpackMerge.strategy(
  {
    entry: 'prepend', // or 'replace', defaults to 'append'
    'module.loaders': 'prepend'
  }
)(a, b);

// smartStrategy
var output = webpackMerge.smartStrategy(
  {
    entry: 'prepend', // or 'replace'
    'module.loaders': 'prepend'
  }
)(a, b);

// smart
var output = webpackMerge.smart({
  loaders: [{
    test: /\.js$/,
    loader: 'babel'
  }]
}, {
  loaders: [{
    test: /\.js$/,
    loader: 'coffee'
  }]
});

// multiple
var path = 'asdf'
var baseConfig = {
  server: {
    target: 'node',
    output: {
      path: path,
      filename: 'lib.node.js'
    }
  },
  client: {
    output: {
      path: path,
      filename: 'lib.js'
    }
  }
};

var production = {
  client: {
    output: {
      path: path,
      filename: '[name].[hash].js'
    }
  }
}

var output = webpackMerge.multiple(baseConfig, production)

