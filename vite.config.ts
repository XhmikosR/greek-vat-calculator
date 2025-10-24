import {defineConfig} from 'vite';
import {createHtmlPlugin} from 'vite-plugin-html';
import {vitePurgeCSS} from './vite-plugin-purgecss.ts';
import {inlineAssets} from './vite-plugin-inline.ts';

export default defineConfig(({mode}) => {
  const isDev = mode === 'development';

  return {
    root: 'src',
    publicDir: '../public',

    build: {
      outDir: '../_site',
      emptyOutDir: true,
      assetsInlineLimit: 0, // Don't inline assets by default; we'll handle this
      cssCodeSplit: false,
      rollupOptions: {
        input: {
          main: '/index.html',
          404: '/404.html'
        },
        output: {
          assetFileNames(assetInfo) {
            // For production, we want to inline CSS and JS
            if (assetInfo.names?.[0] === 'main.css') {
              return 'assets/main-[hash].css';
            }

            if (assetInfo.names?.[0]?.endsWith('.css')) {
              return 'css/[name]-[hash][extname]';
            }

            if (assetInfo.names?.[0]?.endsWith('.js')) {
              return 'js/[name]-[hash][extname]';
            }

            return 'assets/[name]-[hash][extname]';
          },
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js'
        }
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

      // Remove unused CSS and inline for production builds
      !isDev && vitePurgeCSS(),
      !isDev && inlineAssets()
    ].filter(Boolean),

    resolve: {
      alias: {
        '~bootstrap': 'bootstrap'
      }
    }
  };
});
