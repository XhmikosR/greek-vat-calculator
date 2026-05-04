import {defineConfig} from 'vite';
import {createHtmlPlugin} from 'vite-plugin-html';
import {inlineAssets} from './vite-plugin-inline.ts';

export default defineConfig(({mode}) => {
  const isDev = mode === 'development';

  return {
    root: 'src',
    publicDir: '../public',

    build: {
      outDir: '../_site',
      emptyOutDir: true,
      cssCodeSplit: false,
      rollupOptions: {
        input: '/index.html'
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          passes: 2
        },
        format: {
          comments: false
        }
      },
      cssMinify: true
    },

    css: {
      devSourcemap: isDev
    },

    server: {
      port: 8001,
      host: 'localhost',
      open: true,
      strictPort: false
    },

    plugins: [
      createHtmlPlugin({
        minify: !isDev && {
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
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeTagWhitespace: false,
          sortAttributes: true,
          sortClassName: true
        }
      }),

      !isDev && inlineAssets()
    ].filter(Boolean),

    resolve: {
      alias: {
        '~bootstrap': 'bootstrap'
      }
    }
  };
});
