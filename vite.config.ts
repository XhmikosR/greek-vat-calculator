import process from 'node:process';
import {defineConfig} from 'vite';
import {
  inlineAssets,
  injectSwVersion,
  generateMeta,
  minifyHtml
} from './vite-plugin-inline.ts';

const src = 'src';
const publicDir = '../public';
const outDir = '../_site';

export default defineConfig(({mode}) => {
  const isDev = mode === 'development';

  return {
    root: src,
    publicDir,

    define: {
      __PROD__: !isDev
    },

    build: {
      outDir,
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
      !isDev && minifyHtml(),
      !isDev && inlineAssets(),
      !isDev && injectSwVersion(),
      !isDev && generateMeta({
        LASTMOD: new Date().toISOString().slice(0, 10),
        DISALLOW: process.env.NETLIFY ? ' /' : ''
      })
    ].filter(Boolean),

    resolve: {
      alias: {
        '~bootstrap': 'bootstrap'
      }
    }
  };
});
