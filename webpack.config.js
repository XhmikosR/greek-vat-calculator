'use strict';

var path = require('path');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlInlineCssWebpackPlugin = require('html-inline-css-webpack-plugin').default;

// Custom plugin to inline the JS bundle directly into the HTML output
function InlineJsHtmlPlugin() {
  // Constructor intentionally left empty
}

InlineJsHtmlPlugin.prototype.apply = function(compiler) {
  compiler.hooks.compilation.tap('InlineJsHtmlPlugin', function(compilation) {
    HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
      'InlineJsHtmlPlugin',
      function(data, cb) {
        var inlinedAssets = [];

        data.html = data.html.replace(
          /<script\s[^>]*\bsrc=["']?([^"'\s>]+)["']?[^>]*><\/script>/g,
          function(match, src) {
            var assetKey = src.replace(/^\//, '');
            var asset = compilation.getAsset(assetKey);

            if (asset) {
              inlinedAssets.push(assetKey);
              return '<script>' + asset.source.source() + '</script>';
            }
            return match;
          }
        );

        inlinedAssets.forEach(function(assetKey) {
          compilation.deleteAsset(assetKey);
        });

        return cb(null, data);
      }
    );
  });
};

module.exports = function(env, argv) {
  var isProd = argv.mode === 'production';

  var minifyOptions = isProd ?
    {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      conservativeCollapse: false,
      decodeEntities: true,
      minifyCSS: {
        level: {
          1: {
            specialComments: 0
          },
          2: {
            all: false,
            mergeMedia: true,
            removeDuplicateMediaBlocks: true,
            removeEmpty: true
          }
        }
      },
      minifyJS: true,
      minifyURLs: false,
      processConditionalComments: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeOptionalTags: false,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeTagWhitespace: false,
      sortAttributes: true,
      sortClassName: true
    } :
    false;

  var config = {
    entry: ['./src/css/main.scss', './src/js/main.js'],
    output: {
      path: path.resolve(__dirname, '_site'),
      filename: 'js/main.js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('postcss-combine-duplicated-selectors')(),
                    require('autoprefixer'),
                    isProd && require('@fullhuman/postcss-purgecss')({
                      content: [
                        './src/**/*.html',
                        './src/**/*.js'
                      ],
                      keyframes: true,
                      variables: false
                    })
                  ].filter(Boolean)
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
                sassOptions: {
                  loadPaths: ['node_modules'],
                  style: 'compressed'
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/main.css'
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        inject: 'body',
        minify: minifyOptions
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/img',
            to: 'img'
          },
          {
            from: 'src/manifest.json',
            to: 'manifest.json'
          },
          {
            from: 'src/robots.txt',
            to: 'robots.txt'
          },
          {
            from: 'src/404.html',
            to: '404.html'
          },
          {
            from: 'src/googleb7d9bd0c5429cca2.html',
            to: 'googleb7d9bd0c5429cca2.html'
          }
        ]
      })
    ].concat(isProd ? [new HtmlInlineCssWebpackPlugin(), new InlineJsHtmlPlugin()] : [])
  };

  if (!isProd) {
    config.devServer = {
      static: path.resolve(__dirname, '_site'),
      port: 8001,
      open: true,
      watchFiles: ['src/**/*']
    };
  }

  return config;
};
