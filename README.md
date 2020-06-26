[![Financial Contributors on Open Collective](https://opencollective.com/webpack-merge/all/badge.svg?label=financial+contributors)](https://opencollective.com/webpack-merge) [![build status](https://secure.travis-ci.org/survivejs/webpack-merge.svg)](http://travis-ci.org/survivejs/webpack-merge) [![codecov](https://codecov.io/gh/survivejs/webpack-merge/branch/master/graph/badge.svg)](https://codecov.io/gh/survivejs/webpack-merge)

# webpack-merge - Merge designed for Webpack

**webpack-merge** provides a `merge` function that concatenates arrays and merges objects creating a new object. If functions are encountered, it will execute them, run the results through the algorithm, and then wrap the returned values within a function again.

This behavior is particularly useful in configuring webpack although it has uses beyond it. Whenever you need to merge configuration objects, **webpack-merge** can come in handy.

## Standard Merging

### **`merge(...configuration | [...configuration])`**

`merge` is the core, and the most important idea, of the API. Often this is all you need unless you want further customization.

```javascript
// Default API
var output = merge(object1, object2, object3, ...);

// You can pass an array of objects directly.
// This works with all available functions.
var output = merge([object1, object2, object3]);

// Please note that where keys match,
// the objects to the right take precedence:
var output = merge(
  { fruit: "apple", color: "red" },
  { fruit: "strawberries" }
);
console.log(output);
// { color: "red", fruit: "strawberries"}
```

### **`merge({ customizeArray, customizeObject })(...configuration | [...configuration])`**

`merge` behavior can be customized per field through a curried customization API.

```javascript
// Customizing array/object behavior
var output = merge(
  {
    customizeArray(a, b, key) {
      if (key === 'extensions') {
        return _.uniq([...a, ...b]);
      }

      // Fall back to default merging
      return undefined;
    },
    customizeObject(a, b, key) {
      if (key === 'module') {
        // Custom merging
        return _.merge({}, a, b);
      }

      // Fall back to default merging
      return undefined;
    }
  }
)(object1, object2, object3, ...);
```

For example, if the previous code was invoked with only `object1` and `object2`
with `object1` as:

```
{
    foo1: ['object1'],
    foo2: ['object1'],
    bar1: { object1: {} },
    bar2: { object1: {} },
}
```

and `object2` as:

```
{
    foo1: ['object2'],
    foo2: ['object2'],
    bar1: { object2: {} },
    bar2: { object2: {} },
}
```

then `customizeArray` will be invoked for each property of `Array` type, i.e:

```
customizeArray(['object1'], ['object2'], 'foo1');
customizeArray(['object1'], ['object2'], 'foo2');
```

and `customizeObject` will be invoked for each property of `Object` type, i.e:

```
customizeObject({ object1: {} }, { object2: {} }, bar1);
customizeObject({ object1: {} }, { object2: {} }, bar2);
```

### **`merge.unique(<field>, <fields>, field => field)`**

The first <field> is the config property to look through for duplicates.

<fields> represents the values that should be unique when you run the field => field function on each duplicate.

```javascript
const output = merge({
  customizeArray: merge.unique(
    "plugins",
    ["HotModuleReplacementPlugin"],
    (plugin) => plugin.constructor && plugin.constructor.name
  ),
})(
  {
    plugins: [new webpack.HotModuleReplacementPlugin()],
  },
  {
    plugins: [new webpack.HotModuleReplacementPlugin()],
  }
);

// Output contains only single HotModuleReplacementPlugin now.
```

## Merging with Strategies

### **`merge.strategy({ <field>: '<prepend|append|replace>''})(...configuration | [...configuration])`**

Given you may want to configure merging behavior per field, there's a strategy variant:

```javascript
// Merging with a specific merge strategy
var output = merge.strategy(
  {
    entry: 'prepend', // or 'replace', defaults to 'append'
    'module.rules': 'prepend'
  }
)(object1, object2, object3, ...);
```

**webpack.config.js**

```javascript
var path = require('path');
var merge = require('webpack-merge');

var TARGET = process.env.npm_lifecycle_event;

var common = {
  entry: path.join(__dirname, 'app'),
  ...
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
    ],
  },
};

if(TARGET === 'start') {
  module.exports = merge(common, {
    module: {
      // loaders will get concatenated!
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel?stage=1',
          include: path.join(ROOT_PATH, 'app'),
        },
      ],
    },
    ...
  });
}

if(TARGET === 'build') {
  module.exports = merge(common, {
    ...
  });
}

...
```

## Multiple Merging

### **`merge.multiple(...configuration | [...configuration])`**

Sometimes you may need to support multiple targets, _webpack-merge_ will accept an object where each key represents the target configuration. The output becomes an _array_ of configurations where matching keys are merged and non-matching keys are added.

```javascript
var path = require("path");
var baseConfig = {
  server: {
    target: "node",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "lib.node.js",
    },
  },
  client: {
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "lib.js",
    },
  },
};

// specialized configuration
var production = {
  client: {
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[hash].js",
    },
  },
};

module.exports = merge.multiple(baseConfig, production);
```

> Check out [SurviveJS - Webpack](http://survivejs.com/) to dig deeper into the topic.

## Development

1. `npm i`
1. `npm run build`
1. `npm run watch`

Before contributing, please open an issue where to discuss.

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/survivejs/webpack-merge/graphs/contributors"><img src="https://opencollective.com/webpack-merge/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/webpack-merge/contribute)]

#### Individuals

<a href="https://opencollective.com/webpack-merge"><img src="https://opencollective.com/webpack-merge/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/webpack-merge/contribute)]

<a href="https://opencollective.com/webpack-merge/organization/0/website"><img src="https://opencollective.com/webpack-merge/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/webpack-merge/organization/1/website"><img src="https://opencollective.com/webpack-merge/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/webpack-merge/organization/2/website"><img src="https://opencollective.com/webpack-merge/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/webpack-merge/organization/3/website"><img src="https://opencollective.com/webpack-merge/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/webpack-merge/organization/4/website"><img src="https://opencollective.com/webpack-merge/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/webpack-merge/organization/5/website"><img src="https://opencollective.com/webpack-merge/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/webpack-merge/organization/6/website"><img src="https://opencollective.com/webpack-merge/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/webpack-merge/organization/7/website"><img src="https://opencollective.com/webpack-merge/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/webpack-merge/organization/8/website"><img src="https://opencollective.com/webpack-merge/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/webpack-merge/organization/9/website"><img src="https://opencollective.com/webpack-merge/organization/9/avatar.svg"></a>

## License

_webpack-merge_ is available under MIT. See LICENSE for more details.
