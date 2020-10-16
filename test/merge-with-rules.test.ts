import assert from "assert";
import { mergeWithRules } from "../resolve";
import { CustomizeRule } from "../src/types";

describe("Merge with rules", function () {
  it("should replace with nested notation", function () {
    const base = {
      entry: "demo",
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["css-loader"],
          },
          {
            test: /\.css$/,
            loaders: ["style-loader"],
          },
        ],
      },
    };
    const development = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["style-loader"],
          },
          {
            test: /\.less$/,
            loaders: ["css-loader"],
          },
        ],
      },
    };
    const result = {
      entry: "demo",
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["style-loader"],
          },
          {
            test: /\.css$/,
            loaders: ["style-loader"],
          },
          {
            test: /\.less$/,
            loaders: ["css-loader"],
          },
        ],
      },
    };

    assert.deepStrictEqual(
      mergeWithRules({
        module: {
          rules: {
            test: CustomizeRule.Match,
            loaders: CustomizeRule.Replace,
          },
        },
      })(base, development),
      result
    );
  });

  it("should append with nested notation", function () {
    const base = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["css-loader"],
          },
        ],
      },
    };
    const development = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["style-loader"],
          },
        ],
      },
    };
    const result = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["css-loader", "style-loader"],
          },
        ],
      },
    };

    assert.deepStrictEqual(
      mergeWithRules({
        module: {
          rules: {
            test: CustomizeRule.Match,
            loaders: CustomizeRule.Append,
          },
        },
      })(base, development),
      result
    );
  });

  it("should prepend with nested notation", function () {
    const base = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["css-loader"],
          },
        ],
      },
    };
    const development = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["style-loader"],
          },
        ],
      },
    };
    const result = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["style-loader", "css-loader"],
          },
        ],
      },
    };

    assert.deepStrictEqual(
      mergeWithRules({
        module: {
          rules: {
            test: CustomizeRule.Match,
            loaders: CustomizeRule.Prepend,
          },
        },
      })(base, development),
      result
    );
  });

  it("should merge #146", function () {
    const a = {
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [{ loader: "style-loader" }, { loader: "sass-loader" }],
          },
        ],
      },
    };
    const b = {
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
                options: {
                  modules: true,
                },
              },
            ],
          },
        ],
      },
    };
    const result = {
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
                options: {
                  modules: true,
                },
              },
              { loader: "sass-loader" },
            ],
          },
        ],
      },
    };

    assert.deepStrictEqual(
      mergeWithRules({
        module: {
          rules: {
            test: CustomizeRule.Match,
            use: {
              loader: CustomizeRule.Match,
              options: CustomizeRule.Replace,
            },
          },
        },
      })(a, b),
      result
    );
  });

  it("should merge #149", function () {
    const base = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: [
              {
                loader: "css-loader",
              },
              {
                loader: "resolve-url-loader",
              },
            ],
          },
        ],
      },
    };
    const development = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: [
              {
                loader: "css-loader",
                options: {
                  sourceMap: true,
                },
              },
            ],
          },
        ],
      },
    };
    const result = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: [
              {
                loader: "css-loader",
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: "resolve-url-loader",
              },
            ],
          },
        ],
      },
    };

    assert.deepStrictEqual(
      mergeWithRules({
        module: {
          rules: {
            test: CustomizeRule.Match,
            loaders: {
              loader: CustomizeRule.Match,
              options: CustomizeRule.Replace,
            },
          },
        },
      })(base, development),
      result
    );
  });

  it("should merge #157", function () {
    const base = {
      entry: "demo",
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["css-loader"],
          },
          {
            test: /\.css$/,
            loaders: ["style-loader"],
          },
        ],
      },
      plugins: [{ name: "StylelintPlugin" }],
    };
    const development = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["style-loader"],
          },
          {
            test: /\.less$/,
            loaders: ["css-loader"],
          },
        ],
      },
      plugins: [{ name: "MiniCssExtractPlugin" }],
    };
    const result = {
      entry: "demo",
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["style-loader"],
          },
          {
            test: /\.css$/,
            loaders: ["style-loader"],
          },
          {
            test: /\.less$/,
            loaders: ["css-loader"],
          },
        ],
      },
      plugins: [{ name: "StylelintPlugin" }, { name: "MiniCssExtractPlugin" }],
    };

    assert.deepStrictEqual(
      mergeWithRules({
        module: {
          rules: {
            test: CustomizeRule.Match,
            loaders: CustomizeRule.Replace,
          },
        },
      })(base, development),
      result
    );
  });

  it("should merge with a parser loader", function () {
    const defaultConfig = {
      module: {
        rules: [
          {
            parser: {
              system: false,
            },
          },
          {
            test: /\.(js|ts)x?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "babel-loader",
              },
            ],
          },
          {
            test: /\.css$/i,
            include: [/node_modules/, /src/],
            use: [
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
                options: {
                  modules: false,
                },
              },
            ],
          },
        ],
      },
    };
    const localConfig = {
      module: {
        rules: [
          {
            test: /\.html$/i,
            use: [{ loader: "html-loader" }],
          },
          {
            test: /\.css$/i,
            use: [
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: "postcss-loader",
              },
            ],
          },
        ],
      },
    };
    const result = {
      module: {
        rules: [
          {
            parser: {
              system: false,
            },
          },
          {
            test: /\.(js|ts)x?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "babel-loader",
              },
            ],
          },
          {
            test: /\.css$/i,
            include: [/node_modules/, /src/],
            use: [
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: "postcss-loader",
              },
            ],
          },
          {
            test: /\.html$/i,
            use: [{ loader: "html-loader" }],
          },
        ],
      },
    };

    assert.deepStrictEqual(
      mergeWithRules({
        module: {
          rules: {
            test: CustomizeRule.Match,
            use: {
              loader: CustomizeRule.Match,
              options: CustomizeRule.Replace,
            },
          },
        },
      })(defaultConfig, localConfig),
      result
    );
  });

  it("should merge without rule (#151)", function () {
    const module = {
      rules: {
        test: CustomizeRule.Match,
        use: {
          loader: CustomizeRule.Match,
          options: CustomizeRule.Replace,
        },
      },
    };
    const _mergeWithoutRule = mergeWithRules({
      module,
    });
    const config = { resolve: { extensions: [".js"] } };

    expect(() => _mergeWithoutRule(config, config)).not.toThrow();
  });

  it("should merge with explicit rule (#151)", function () {
    const module = {
      rules: {
        test: CustomizeRule.Match,
        use: {
          loader: CustomizeRule.Match,
          options: CustomizeRule.Replace,
        },
      },
    };
    const _mergeWithExplicitRule = mergeWithRules({
      module,
      resolve: {
        extensions: CustomizeRule.Append,
        module: CustomizeRule.Match,
        alias: CustomizeRule.Match,
      },
    });
    const config = { resolve: { extensions: [".js"] } };

    expect(_mergeWithExplicitRule(config, config)).toEqual(config);
  });
});
