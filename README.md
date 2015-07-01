[![build status](https://secure.travis-ci.org/survivejs/webpack-merge.png)](http://travis-ci.org/survivejs/webpack-merge)
# webpack-merge - Merge designed for Webpack

Normal merge function isn't that useful with Webpack configuration as it will override object keys and arrays by default. It is more beneficial to concatenate arrays instead. This little helper achieves just that. Consider the example below:

```javascript
var merge = require('webpack-merge');

var common = {
  entry: [path.join(ROOT_PATH, 'app/main.jsx')],
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

if(TARGET === 'build') {
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

...
```

Check out [SurviveJS - Webpack and React](http://survivejs.com/) to dig deeper into the topic.

## License

webpack-merge is available under MIT. See LICENSE for more details.

