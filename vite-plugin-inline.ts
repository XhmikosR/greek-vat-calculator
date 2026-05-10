import fs from 'node:fs';
import path from 'node:path';
import {minify, type Options as HtmlMinifierOptions} from 'html-minifier-terser';
import {minify as terserMinify, type MinifyOptions} from 'terser';
import type {Plugin} from 'vite';

export const terserOptions: MinifyOptions = {
  compress: {
    passes: 2
  },
  format: {
    comments: false
  }
};

const htmLMinifierOptions: HtmlMinifierOptions = {
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
  minifyJS: false, // JavaScript is already minified by vite
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

function isEnoent(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

/**
 * Vite plugin to render %%TOKEN%% placeholders in sitemap.xml and robots.txt
 */
export function generateMeta(tokens: Record<string, string>): Plugin {
  return {
    name: 'vite-plugin-generate-meta',
    apply: 'build',
    writeBundle(options) {
      const outDir = options.dir ?? '../_site';

      for (const file of ['sitemap.xml', 'robots.txt']) {
        const src = path.resolve('public', file);
        let rendered: string;
        try {
          rendered = fs.readFileSync(src, 'utf8');
        } catch(error) {
          if (!isEnoent(error)) throw error;
          continue;
        }

        for (const [key, value] of Object.entries(tokens)) {
          rendered = rendered.replaceAll(`%%${key}%%`, value);
        }

        fs.writeFileSync(path.resolve(outDir, file), rendered);
      }
    }
  };
}

/**
 * Vite plugin to inject a version string into the service worker file during build
 */
export function injectSwVersion(): Plugin {
  return {
    name: 'vite-plugin-inject-sw-version',
    enforce: 'post',
    apply: 'build',
    async writeBundle(options) {
      const outDir = options.dir ?? '../_site';
      const swPath = path.resolve(outDir, 'sw.js');

      try {
        const version = Date.now().toString();
        const content = fs.readFileSync(swPath, 'utf8');
        const replaced = content.replaceAll('__SW_VERSION__', version);

        const result = await terserMinify(replaced, terserOptions);

        fs.writeFileSync(swPath, result.code ?? replaced);
      } catch(error) {
        if (!isEnoent(error)) throw error;
      }
    }
  };
}

/**
 * Vite plugin to minify HTML output using html-minifier-terser
 */
export function minifyHtml(): Plugin {
  return {
    name: 'vite-plugin-minify-html',
    enforce: 'post',
    apply: 'build',
    async generateBundle(_options, bundle) {
      await Promise.all(
        Object.entries(bundle).map(async([fileName, asset]) => {
          if (asset.type === 'asset' && fileName.endsWith('.html')) {
            asset.source = await minify(asset.source.toString(), htmLMinifierOptions);
          }
        })
      );
    }
  };
}
