import path from 'node:path';
import { minify } from 'html-minifier-terser';
import * as sass from 'sass';
import autoprefixer from 'autoprefixer';
import combineDuplicatedSelectors from 'postcss-combine-duplicated-selectors';
import purgecss from '@fullhuman/postcss-purgecss';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlInlineCssWebpackPluginModule from 'html-inline-css-webpack-plugin';

const { default: HtmlInlineCssWebpackPlugin } = HtmlInlineCssWebpackPluginModule;

const htmlMinifyOptions = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  conservativeCollapse: false,
  decodeEntities: true,
  minifyCSS: {
    level: {
      1: { specialComments: 0 },
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
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeTagWhitespace: false,
  sortAttributes: true,
  sortClassName: true
};

class InlineJsHtmlPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('InlineJsHtmlPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'InlineJsHtmlPlugin',
        (data, cb) => {
          const inlinedAssets = [];

          data.html = data.html.replaceAll(
            /<script\s[^>]*\bsrc=["']?([^"'\s>]+)["']?[^>]*><\/script>/gv,
            (match, src) => {
              const assetKey = src.replace(/^\//v, '');
              const asset = compilation.getAsset(assetKey);

              if (asset) {
                inlinedAssets.push(assetKey);
                return `<script>${asset.source.source()}</script>`;
              }

              return match;
            }
          );

          for (const assetKey of inlinedAssets) {
            compilation.deleteAsset(assetKey);
          }

          cb(null, data);
        }
      );
    });
  }
}

class HtmlMinifierPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlMinifierPlugin', compilation => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: 'HtmlMinifierPlugin',
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
        },
        async assets => {
          for (const [filename, asset] of Object.entries(assets)) {
            if (
              !filename.endsWith('.html') ||
              filename === '404.html' ||
              filename.startsWith('google')
            ) {
              continue;
            }

            // eslint-disable-next-line no-await-in-loop
            const minified = await minify(asset.source(), htmlMinifyOptions);
            compilation.updateAsset(
              filename,
              new webpack.sources.RawSource(minified)
            );
          }
        }
      );
    });
  }
}

const webpackConfig = (env, argv) => {
  const isProd = argv.mode === 'production';

  const postcssPlugins = [
    combineDuplicatedSelectors(),
    autoprefixer,
    ...(isProd ?
      [
        purgecss({
          content: ['./src/**/*.html', './src/**/*.js'],
          keyframes: true,
          variables: false
        })
      ] :
      [])
  ];

  const config = {
    entry: ['./src/css/main.scss', './src/js/main.js'],
    output: {
      path: path.resolve(import.meta.dirname, '_site'),
      filename: 'js/main.js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.scss$/v,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: postcssPlugins
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: sass,
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
      new MiniCssExtractPlugin({ filename: 'css/main.css' }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        inject: 'body',
        minify: false
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/img', to: 'img' },
          { from: 'src/manifest.json', to: 'manifest.json' },
          { from: 'src/robots.txt', to: 'robots.txt' },
          { from: 'src/404.html', to: '404.html' },
          {
            from: 'src/googleb7d9bd0c5429cca2.html',
            to: 'googleb7d9bd0c5429cca2.html'
          }
        ]
      }),
      ...(isProd ?
        [
          new HtmlInlineCssWebpackPlugin(),
          new InlineJsHtmlPlugin(),
          new HtmlMinifierPlugin()
        ] :
        [])
    ]
  };

  if (!isProd) {
    config.devServer = {
      static: path.resolve(import.meta.dirname, '_site'),
      port: 8001,
      open: true,
      watchFiles: ['src/**/*']
    };
  }

  return config;
};

export default webpackConfig;
