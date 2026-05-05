import fs from 'node:fs';
import path from 'node:path';
import type {Plugin} from 'vite';

type AssetInfo = {
  fileName: string;
  content: string;
};

/**
 * Vite plugin to inline CSS and JS assets into HTML
 */
export function inlineAssets(): Plugin {
  return {
    name: 'vite-plugin-inline-assets',
    enforce: 'post',

    generateBundle(_options, bundle) {
      // Collect all CSS and JS content first
      const cssAssets: AssetInfo[] = [];
      const jsAssets: AssetInfo[] = [];

      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type === 'asset' && fileName.endsWith('.css')) {
          cssAssets.push({fileName, content: (asset).source.toString()});
        } else if (asset.type === 'chunk' && fileName.endsWith('.js')) {
          jsAssets.push({fileName, content: (asset).code});
        }
      }

      // Process HTML files
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (!fileName.endsWith('.html') || asset.type !== 'asset') {
          continue;
        }

        let html = asset.source.toString();

        // Remove all CSS link tags (handles both rel="stylesheet" and href=...css patterns)
        html = html.replaceAll(/<link[^>]*?(?:rel=["']?stylesheet["']?|href=["']?[^"']*\.css["']?)[^>]*?>/gi, '');

        if (cssAssets.length > 0) {
          // Remove CSS comments and inline
          const cssContent = cssAssets
            .map(css => css.content.replaceAll(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, ''))
            .join('');
          const inlinedCss = `<style>${cssContent}</style>`;
          // Find the last closing tag before body, or insert before body
          html = html.includes('<body') ? html.replace(/<body/i, `${inlinedCss}<body`) : html.replace('</head>', `${inlinedCss}</head>`);
        }

        // Remove all script tags with src attribute
        // CodeQL[js/incomplete-multi-character-sanitization] - build-time transformation of bundle output, not user input
        html = html.replaceAll(/<script\b[^>]*?\bsrc\s*=\s*["']?[^"'\s>]+\.js\b[^>]*?><\/script>/gi, '');

        if (jsAssets.length > 0) {
          const inlinedJs = jsAssets.map(js => `<script type="module">${js.content}</script>`).join('');

          // Try to insert before </body>, if not found try </html>, if not found append to end
          if (html.includes('</body>')) {
            html = html.replace('</body>', `${inlinedJs}</body>`);
          } else if (html.includes('</footer>')) {
            html = html.replace('</footer>', `</footer>${inlinedJs}`);
          } else {
            html += inlinedJs;
          }
        }

        asset.source = html;
      }

      // Delete CSS and JS files from bundle since they're now inlined
      for (const asset of [...cssAssets, ...jsAssets]) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete bundle[asset.fileName];
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
    writeBundle(options) {
      const outDir = options.dir ?? '../_site';
      const swPath = path.resolve(outDir, 'sw.js');
      if (fs.existsSync(swPath)) {
        const version = Date.now().toString();
        const content = fs.readFileSync(swPath, 'utf8');
        fs.writeFileSync(swPath, content.replaceAll('__SW_VERSION__', version));
      }
    }
  };
}
