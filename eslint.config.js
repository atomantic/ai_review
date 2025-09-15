import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    rules: {
      // Traditional approach: Easy fixes are ERRORS (automatable without AI)
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { 'max': 1 }],
      'brace-style': ['error', '1tbs'],
      'curly': ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-duplicate-imports': 'error',
      // Complex issues that traditionally required human involvement: WARNINGS
      'complexity': ['warn', { 'max': 10 }], // Industry standard
      'max-depth': ['warn', { 'max': 4 }],
      'max-nested-callbacks': ['warn', { 'max': 3 }],
      'max-params': ['warn', { 'max': 4 }],
      'max-statements': ['warn', { 'max': 15 }],
      'max-lines-per-function': ['warn', { 'max': 200 }],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'prefer-arrow-callback': 'warn',
      'no-magic-numbers': ['warn', { 'ignore': [0, 1, -1] }]
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly'
      }
    }
  }
];
