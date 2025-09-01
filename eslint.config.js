import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    rules: {
      // Traditional approach: Easy fixes are ERRORS (automatable without AI)
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
      "indent": ["error", 2],
      "comma-dangle": ["error", "never"],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "brace-style": ["error", "1tbs"],
      "curly": ["error", "all"],
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-duplicate-imports": "error",
      
      // Complex issues that traditionally required human involvement: WARNINGS
      "complexity": ["warn", { "max": 3 }], // Very low to trigger warnings
      "max-depth": ["warn", { "max": 2 }],
      "max-nested-callbacks": ["warn", { "max": 2 }],
      "max-params": ["warn", { "max": 2 }],
      "max-statements": ["warn", { "max": 5 }],
      "max-lines-per-function": ["warn", { "max": 10 }],
      "no-console": "warn",
      "no-debugger": "warn",
      "prefer-arrow-callback": "warn",
      "no-magic-numbers": ["warn", { "ignore": [0, 1, -1] }]
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