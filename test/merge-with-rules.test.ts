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

  it("should merge #193", function () {
    const a = {
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
                options: {
                  postcssOptions: {
                    plugins: [["111"], ["222"]],
                  },
                },
              },
              { loader: "sass-loader" },
            ],
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
                  postcssOptions: {
                    plugins: [["333"]],
                  },
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
                  postcssOptions: {
                    plugins: [["111"], ["222"], ["333"]],
                  },
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
              options: {
                postcssOptions: {
                  plugins: CustomizeRule.Append,
                },
              },
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

  it("should merge with append without match (#151)", function () {
    const _mergeWithExplicitRule = mergeWithRules({
      resolve: {
        extensions: CustomizeRule.Append,
      },
    });
    const a = { resolve: { extensions: [".js"] } };
    const b = { resolve: { extensions: [".css"] } };
    const result = { resolve: { extensions: [".js", ".css"] } };

    expect(_mergeWithExplicitRule(a, b)).toEqual(result);
  });

  it("should merge with prepend without match (#151)", function () {
    const _mergeWithExplicitRule = mergeWithRules({
      resolve: {
        extensions: CustomizeRule.Prepend,
      },
    });
    const a = { resolve: { extensions: [".js"] } };
    const b = { resolve: { extensions: [".css"] } };
    const result = { resolve: { extensions: [".css", ".js"] } };

    expect(_mergeWithExplicitRule(a, b)).toEqual(result);
  });

  it("should merge with replace without match (#151)", function () {
    const _mergeWithExplicitRule = mergeWithRules({
      resolve: {
        extensions: CustomizeRule.Replace,
      },
    });
    const a = { resolve: { extensions: [".js"] } };
    const b = { resolve: { extensions: [".css"] } };
    const result = { resolve: { extensions: [".css"] } };

    expect(_mergeWithExplicitRule(a, b)).toEqual(result);
  });

  it("should merge mixed rules", function () {
    const a = {
      resolve: { extensions: [".js"] },
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
      resolve: { extensions: [".css"] },
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
      resolve: { extensions: [".js", ".css"] },
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
        resolve: {
          extensions: CustomizeRule.Append,
        },
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

  it("should merge objects (#163)", function () {
    const _mergeWithExplicitRule = mergeWithRules({
      module: {
        rules: {
          test: CustomizeRule.Match,
          use: {
            loader: CustomizeRule.Match,
            options: CustomizeRule.Merge,
          },
        },
      },
    });
    const a = {
      resolve: { extensions: [".js"] },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              { loader: "style-loader", options: { modules: true } },
              { loader: "sass-loader" },
            ],
          },
        ],
      },
    };
    const b = {
      resolve: { extensions: [".css"] },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
                options: {
                  modules: true,
                  another: true,
                },
              },
            ],
          },
        ],
      },
    };
    const result = {
      resolve: { extensions: [".js", ".css"] },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
                options: {
                  modules: true,
                  another: true,
                },
              },
              { loader: "sass-loader" },
            ],
          },
        ],
      },
    };

    expect(_mergeWithExplicitRule(a, b)).toEqual(result);
  });

  it("should throw if trying to merge non-objects", function () {
    const _mergeWithExplicitRule = mergeWithRules({
      module: {
        rules: {
          test: CustomizeRule.Match,
          use: {
            loader: CustomizeRule.Match,
            options: CustomizeRule.Merge,
          },
        },
      },
    });
    const a = {
      resolve: { extensions: [".js"] },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              { loader: "style-loader", options: [] },
              { loader: "sass-loader" },
            ],
          },
        ],
      },
    };
    const b = {
      resolve: { extensions: [".css"] },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
                options: [],
              },
            ],
          },
        ],
      },
    };

    assert.throws(() => _mergeWithExplicitRule(a, b), {
      name: "TypeError",
      message: "Trying to merge non-objects",
    });
  });

  it("should throw if trying to append non-arrays", function () {
    const _mergeWithExplicitRule = mergeWithRules({
      module: {
        rules: {
          test: CustomizeRule.Match,
          use: {
            loader: CustomizeRule.Match,
            options: CustomizeRule.Append,
          },
        },
      },
    });
    const a = {
      resolve: { extensions: [".js"] },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              { loader: "style-loader", options: {} },
              { loader: "sass-loader" },
            ],
          },
        ],
      },
    };
    const b = {
      resolve: { extensions: [".css"] },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
                options: {},
              },
            ],
          },
        ],
      },
    };

    assert.throws(() => _mergeWithExplicitRule(a, b), {
      name: "TypeError",
      message: "Trying to append non-arrays",
    });
  });

  it("should throw if trying to prepend non-arrays", function () {
    const _mergeWithExplicitRule = mergeWithRules({
      module: {
        rules: {
          test: CustomizeRule.Match,
          use: {
            loader: CustomizeRule.Match,
            options: CustomizeRule.Prepend,
          },
        },
      },
    });
    const a = {
      resolve: { extensions: [".js"] },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              { loader: "style-loader", options: {} },
              { loader: "sass-loader" },
            ],
          },
        ],
      },
    };
    const b = {
      resolve: { extensions: [".css"] },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
                options: {},
              },
            ],
          },
        ],
      },
    };

    assert.throws(() => _mergeWithExplicitRule(a, b), {
      name: "TypeError",
      message: "Trying to prepend non-arrays",
    });
  });

  it("should work with multi-level match (#153)", function () {
    const a = {
      module: {
        rules: [
          {
            test: /\.(sa|sc|c)ss/,
            use: [
              {
                loader: "css-loader",
                options: {
                  importLoaders: 2,
                  modules: { auto: true },
                },
              },
            ],
          },
        ],
      },
    };
    const b = {
      module: {
        rules: [
          {
            test: /\.(sa|sc|c)ss/,
            use: [
              {
                loader: "css-loader",
                options: {
                  modules: {
                    localIdentName: "[hash:base64]",
                  },
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
            test: /\.(sa|sc|c)ss/,
            use: [
              {
                loader: "css-loader",
                options: {
                  importLoaders: 2,
                  modules: { auto: true },
                },
              },
            ],
          },
        ],
      },
    };
    const mergeRules = mergeWithRules({
      module: {
        rules: {
          test: CustomizeRule.Match,
          use: {
            loader: CustomizeRule.Match,
            options: {
              modules: CustomizeRule.Append,
            },
          },
        },
      },
    });

    expect(mergeRules(a, b)).toEqual(result);
  });

  it("should append with local match (#165)", function () {
    const base = {
      module: {
        rules: [
          {
            test: /\.s(a|c)ss$/,
            use: [
              {
                loader: "css-loader",
              },
              {
                loader: "sass-loader",
              },
            ],
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
              {
                loader: "file-loader",
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
            test: /\.s(a|c)ss$/,
            use: ["style-loader"],
          },
        ],
      },
    };
    const result = {
      module: {
        rules: [
          {
            test: /\.s(a|c)ss$/,
            use: [
              {
                loader: "css-loader",
              },
              {
                loader: "sass-loader",
              },
              "style-loader",
            ],
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
              {
                loader: "file-loader",
              },
            ],
          },
        ],
      },
    };

    expect(
      mergeWithRules({
        module: {
          rules: {
            test: CustomizeRule.Match,
            use: CustomizeRule.Append,
          },
        },
      })(base, development)
    ).toEqual(result);
  });

  it("should prepend with local match (#165)", function () {
    const base = {
      module: {
        rules: [
          {
            test: /\.s(a|c)ss$/,
            use: [
              {
                loader: "css-loader",
              },
              {
                loader: "sass-loader",
              },
            ],
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
              {
                loader: "file-loader",
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
            test: /\.s(a|c)ss$/,
            use: ["style-loader"],
          },
        ],
      },
    };
    const result = {
      module: {
        rules: [
          {
            test: /\.s(a|c)ss$/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
              },
              {
                loader: "sass-loader",
              },
            ],
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
              {
                loader: "file-loader",
              },
            ],
          },
        ],
      },
    };

    expect(
      mergeWithRules({
        module: {
          rules: {
            test: CustomizeRule.Match,
            use: CustomizeRule.Prepend,
          },
        },
      })(base, development)
    ).toEqual(result);
  });

  it("should fall back to default behavior without a match when merging (#167)", function () {
    const conf1 = {
      module: {
        rules: [
          {
            test: "/\\.scss$|\\.sass$/",
            use: [
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true,
                },
              },
            ],
          },
        ],
      },
    };
    const conf2 = {
      module: {
        rules: [
          {
            test: "/\\.scss$|\\.sass$/",
            use: [
              {
                loader: "sass-resources-loader",
                options: {
                  resources: ["src/styles/includes.scss"],
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
            test: "/\\.scss$|\\.sass$/",
            use: [
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: "sass-resources-loader",
                options: {
                  resources: ["src/styles/includes.scss"],
                },
              },
            ],
          },
        ],
      },
    };

    expect(
      mergeWithRules({
        module: {
          rules: {
            test: CustomizeRule.Match,
            use: {
              loader: CustomizeRule.Match,
              options: CustomizeRule.Merge,
            },
          },
        },
      })(conf1, conf2)
    ).toEqual(result);
  });

  it("should not merge strings with objects", () => {
    const conf1 = {
      module: {
        rules: [
          {
            test: "some-test",
            use: ["hello-loader"],
          },
        ],
      },
    };

    const conf2 = {
      module: {
        rules: [
          {
            test: "another-test",
            use: [
              {
                loader: "another-loader",
                options: {
                  someoption: "hey",
                },
              },
            ],
          },
        ],
      },
    };

    const expected = {
      module: {
        rules: [
          {
            test: "some-test",
            use: ["hello-loader"],
          },
          {
            test: "another-test",
            use: [
              {
                loader: "another-loader",
                options: {
                  someoption: "hey",
                },
              },
            ],
          },
        ],
      },
    };

    expect(
      mergeWithRules({
        module: {
          rules: {
            test: CustomizeRule.Match,
            use: {
              loader: CustomizeRule.Match,
              options: CustomizeRule.Merge,
            },
          },
        },
      })(conf1, conf2)
    ).toEqual(expected);
  });
});
