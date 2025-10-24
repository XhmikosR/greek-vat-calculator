import globals from 'globals';

export default [
  {
    space: true,
    rules: {
      'import-x/no-anonymous-default-export': 'off',
      '@stylistic/comma-dangle': [
        'error',
        'never'
      ],
      '@stylistic/function-paren-newline': 'off',
      '@stylistic/operator-linebreak': [
        'error',
        'after'
      ],
      '@stylistic/space-before-function-paren': [
        'error',
        'never'
      ],
      '@typescript-eslint/naming-convention': 'off',
      'arrow-body-style': 'off',
      'capitalized-comments': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off'
    }
  },
  {
    files: ['src/js/**'],
    languageOptions: {
      globals: globals.browser
    }
  }
];
