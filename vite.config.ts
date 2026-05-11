import process from 'node:process';
import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';
import {
  injectSwVersion,
  generateMeta,
  minifyHtml,
  terserOptions
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
      rollupOptions: {
        input: '/index.html'
      },
      // target: 'es2017', // floor of .browserslistrc targets
      modulePreload: false, // single-file output has no chunks to preload
      minify: 'terser', // terser is slower than oxc but produces smaller output
      terserOptions,
      cssCodeSplit: false, // single-file output: keep all CSS in one bundle
      cssMinify: 'lightningcss',
      reportCompressedSize: true
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
      !isDev && viteSingleFile({inlinePattern: ['**/*.css']}),
      !isDev && injectSwVersion(),
      !isDev && generateMeta({
        LASTMOD: new Date().toISOString().slice(0, 10),
        DISALLOW: process.env.NETLIFY ? ' /' : ''
      }),
      !isDev && minifyHtml()
    ].filter(Boolean),

    resolve: {
      alias: {
        '~bootstrap': 'bootstrap'
      }
    }
  };
});
