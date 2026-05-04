import process from 'node:process';
import autoprefixer from 'autoprefixer';
import purgecss from '@fullhuman/postcss-purgecss';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  plugins: [
    autoprefixer(),
    ...(isProduction ?
      [purgecss({
        content: [
          './src/**/*.html',
          './src/**/*.ts',
          './node_modules/bootstrap/js/dist/collapse.js'
        ],
        keyframes: true,
        variables: true
      })] :
      [])
  ]
};
