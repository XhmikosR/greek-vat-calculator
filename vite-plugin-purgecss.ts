import {PurgeCSS} from 'purgecss';
import type {Plugin} from 'vite';
import type {NormalizedOutputOptions, OutputBundle, OutputAsset} from 'rollup';

/**
 * Vite plugin to remove unused CSS with PurgeCSS
 */
export function vitePurgeCSS(): Plugin {
  return {
    name: 'vite-plugin-purgecss',
    enforce: 'post',

    async generateBundle(_options: NormalizedOutputOptions, bundle: OutputBundle) {
      const cssAssets: Array<[string, OutputAsset]> = [];

      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type === 'asset' && fileName.endsWith('.css')) {
          cssAssets.push([fileName, asset]);
        }
      }

      if (cssAssets.length === 0) {
        return;
      }

      // Collect HTML and JS content for PurgeCSS analysis
      const content: Array<{raw: string; extension: string}> = [];
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (fileName.endsWith('.html') || fileName.endsWith('.js')) {
          const source = asset.type === 'asset' ?
            (asset).source :
            (asset).code;
          content.push({raw: source.toString(), extension: 'html'});
        }
      }

      // Run PurgeCSS on each CSS asset
      for (const [_fileName, asset] of cssAssets) {
        // eslint-disable-next-line no-await-in-loop
        const purgeCSSResults = await new PurgeCSS().purge({
          content,
          css: [{raw: asset.source.toString()}],
          defaultExtractor: (content: string) => content.match(/[\w-/:]+(?<!:)/g) ?? []
        });

        if (purgeCSSResults[0]) {
          asset.source = purgeCSSResults[0].css;
        }
      }
    }
  };
}
