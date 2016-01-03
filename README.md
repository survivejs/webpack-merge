[![build status](https://secure.travis-ci.org/survivejs/webpack-merge.png)](http://travis-ci.org/survivejs/webpack-merge)
# webpack-merge - Merge designed for Webpack

Normal merge function isn't that useful with webpack configuration as it will override object keys and arrays by default. It is more beneficial to concatenate arrays instead. This little helper achieves just that.

## API

```javascript
var output = merge(object1, object2, object3, ...);

// smarter merging for loaders, see below
var output = merge.smart(object1, object2, object3, ...);
```

## Example

**package.json**

```json
{
  "scripts": {
    "start": "webpack-dev-server",
    "build": "webpack"
  },
  ...
}
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

> Check out [SurviveJS - Webpack and React](http://survivejs.com/) to dig deeper into the topic.

## Smart Merging of Loaders

Webpack-merge tries to be smart about merging loaders when `merge.smart` is used. Loaders with matching tests will be merged into a single loader value.

**Loader string values `loader: 'babel'` override each other.**

```javascript
merge.smart({
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
// will become
{
  loaders: [{
    test: /\.js$/,
    loader: 'coffee'
  }]
}
```

**Loader array values `loaders: ['babel']` will be merged, without duplication.**

```javascript
merge.smart({
  loaders: [{
    test: /\.js$/,
    loaders: ['babel']
  }]
}, {
  loaders: [{
    test: /\.js$/,
    loaders: ['coffee']
  }]
});
// will become
{
  loaders: [{
    test: /\.js$/,
    // prepended because Webpack evaluated these from right to left!
    // this way you can specialize behavior and build the loader chain
    loaders: ['coffee', 'babel']
  }]
}
```

**Loader query strings `loaders: ['babel?plugins[]=object-assign']` will be overridden**

```javascript
merge.smart({
  loaders: [{
    test: /\.js$/,
    loaders: ['babel?plugins[]=object-assign']
  }]
}, {
  loaders: [{
    test: /\.js$/,
    loaders: ['babel', 'coffee']
  }]
});
// will become
{
  loaders: [{
    test: /\.js$/,
    loaders: ['babel', 'coffee']
  }]
}
```

**Loader arrays in source values will have loader strings merged into them.**

```javascript
merge.smart({
  loaders: [{
    test: /\.js$/,
    loader: 'babel'
  }]
}, {
  loaders: [{
    test: /\.js$/,
    loaders: ['coffee']
  }]
});
// will become
{
  loaders: [{
    test: /\.js$/,
    // prepended because Webpack evaluated these from right to left!
    loaders: ['babel', 'coffee']
  }]
}
```

**Loader strings in source values will always override.**

```javascript
merge.smart({
  loaders: [{
    test: /\.js$/,
    loaders: ['babel']
  }]
}, {
  loaders: [{
    test: /\.js$/,
    loader: 'coffee'
  }]
});
// will become
{
  loaders: [{
    test: /\.js$/,
    loader: 'coffee'
  }]
}
```

## Contributors

* [Fernando Montoya](https://github.com/montogeek) - Use separate lodash functions instead of the core package. Faster to install this way.
* [Jonathan Felchlin](https://github.com/GreenGremlin) - Smart merging for loaders.
* [David Gómez](https://github.com/davegomez) - Performance and cosmetic improvements.

## License

*webpack-merge* is available under MIT. See LICENSE for more details.
