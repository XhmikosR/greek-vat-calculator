import path from 'node:path';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { minify } from 'html-minifier-terser';
import autoprefixer from 'autoprefixer';
import combineDuplicatedSelectors from 'postcss-combine-duplicated-selectors';
import purgecss from '@fullhuman/postcss-purgecss';

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

function htmlMinifierPlugin() {
  return {
    name: 'html-minifier',
    enforce: 'post',
    async generateBundle(_options, bundle) {
      for (const [filename, asset] of Object.entries(bundle)) {
        if (
          asset.type === 'asset' &&
          filename.endsWith('.html') &&
          filename !== '404.html' &&
          !filename.startsWith('google')
        ) {
          // eslint-disable-next-line no-await-in-loop
          asset.source = await minify(
            String(asset.source).replaceAll(/<style([^>]*)>/gv, (_, attrs) =>
              `<style${attrs.replaceAll(/\s+crossorigin\b/gv, '')}>`
            ),
            htmlMinifyOptions
          );
        }
      }
    }
  };
}

export default defineConfig(({ command }) => {
  const isProd = command === 'build';

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

  return {
    root: 'src',
    build: {
      outDir: '../_site',
      emptyOutDir: true,
      assetsInlineLimit: 100_000_000,
      chunkSizeWarningLimit: 100_000_000,
      cssCodeSplit: false
    },
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [path.resolve(import.meta.dirname, 'node_modules')]
        }
      },
      postcss: {
        plugins: postcssPlugins
      }
    },
    plugins: [
      viteSingleFile(),
      viteStaticCopy({
        targets: [
          { src: 'img', dest: '' },
          { src: 'manifest.json', dest: '' },
          { src: 'robots.txt', dest: '' },
          { src: '404.html', dest: '' },
          { src: 'googleb7d9bd0c5429cca2.html', dest: '' }
        ]
      }),
      ...(isProd ?
        [htmlMinifierPlugin()] :
        [])
    ],
    server: {
      port: 8001,
      open: true
    }
  };
});
