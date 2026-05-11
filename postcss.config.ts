import process from 'node:process';
import autoprefixer from 'autoprefixer';
import combineSelectors from 'postcss-combine-duplicated-selectors';
import purgecss from '@fullhuman/postcss-purgecss';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  plugins: [
    combineSelectors(),
    autoprefixer(),
    ...(isProduction ?
      [purgecss({
        content: [
          './src/**/*.html',
          './src/**/*.ts',
          './node_modules/bootstrap/js/dist/collapse.js',
          './node_modules/bootstrap/js/dist/dropdown.js'
        ],
        keyframes: true,
        variables: true
      })] :
      [])
  ]
};
