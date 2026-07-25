import globals from 'globals';

export default [
  {
    ignores: [
      '**/*.html'
    ]
  },
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
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/no-unnecessary-global-this': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off'
    }
  },
  {
    files: [
      'src/js/**'
    ],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: [
      'public/sw.js'
    ],
    languageOptions: {
      globals: globals.serviceworker
    }
  }
];
