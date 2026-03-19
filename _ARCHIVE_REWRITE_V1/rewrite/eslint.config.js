/**
 * ESLint flat config — SANTINO v2 (Phase 2).
 * Architectural rules: no window.* in source; no inline-style assignment for UI state.
 */
import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  { ignores: ['node_modules/', 'dist/', '*.config.js', '*.config.ts'] },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      ...js.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      /* Architecture: no global window in feature/source code. Use platform adapter only. */
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='window']",
          message:
            'Do not use window.* in source. Use runtime/kernel or platform adapter (see code-conventions).',
        },
        {
          selector:
            "AssignmentExpression[left.type='MemberExpression'][left.property.name='style']",
          message:
            'Do not assign to element.style for UI state. Use CSS classes and design tokens (see code-conventions).',
        },
      ],
      'no-console': 'warn',
    },
  },
  {
    files: ['src/adapters/**/*.ts', 'src/kernel/error-boundary.ts', 'src/kernel/event-bus.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['e2e/**/*.ts', '**/*.spec.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      ...js.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-restricted-syntax': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['*.config.ts', '*.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-restricted-syntax': 'off',
    },
  },
  eslintConfigPrettier,
];
