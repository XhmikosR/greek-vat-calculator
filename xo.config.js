import globals from 'globals';

/** @type {import('xo').FlatXoConfig} */
const xoConfig = [
  {
    space: 2,
    ignores: ['_site/**'],
  },
  {
    files: ['src/js/**'],
    languageOptions: {
      globals: globals.browser,
    },
  },
];

export default xoConfig;
