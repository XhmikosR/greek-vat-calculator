import globals from 'globals';

export default [
  {
    space: 2,
    rules: {
      '@stylistic/comma-dangle': [
        'error',
        'never'
      ],
      '@stylistic/curly-newline': [
        'error',
        {
          consistent: true
        }
      ],
      '@stylistic/function-paren-newline': 'off',
      '@stylistic/operator-linebreak': [
        'error',
        'after'
      ],
      '@stylistic/spaced-comment': 'off',
      '@stylistic/space-before-function-paren': [
        'error',
        'never'
      ],
      '@typescript-eslint/naming-convention': 'off',
      'arrow-body-style': 'off',
      camelcase: [
        'error',
        {
          properties: 'never'
        }
      ],
      'capitalized-comments': 'off',
      curly: [
        'error',
        'multi-line'
      ],
      'import-x/no-anonymous-default-export': 'off',
      'prefer-template': 'error',
      'require-unicode-regexp': 'off',
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
