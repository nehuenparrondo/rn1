// eslint.config.js — Reglas actuales de TypeScript y React, separadas del backend.
const { defineConfig, globalIgnores } = require('eslint/config');
const js = require('@eslint/js');
const globals = require('globals');
const reactHooks = require('eslint-plugin-react-hooks');
const prettierConfig = require('eslint-config-prettier/flat');
const tseslint = require('typescript-eslint');

module.exports = defineConfig([
  globalIgnores(['backend/**', 'dist/**', '.expo/**']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['*.js'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },
  prettierConfig,
]);
