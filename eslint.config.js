import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'assets/vendor/**',
      'assets/js/modules/core/app.js',
      'assets/js/modules/ui/carousel/swiper-init.js',
      'assets/js/modules/ui/carousel/section1-carousel.js',
      'assets/js/modules/business/stats/section1-stats.js',
      'assets/js/modules/business/stats/section1-stats-size.js',
      'assets/js/modules/utils/ticker/**',
      'assets/js/modules/carousel/**',
      'assets/js/modules/animations/**',
      'assets/js/modules/business/production-section.js',
      'assets/js/modules/business/contracts/contract-*.js',
      'assets/js/modules/core/utils/performance-monitor.js',
      'assets/js/modules/app.js',
    ],
  },
  {
    files: ['assets/js/**/*.js', '*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off',
      'no-empty': 'off',
    },
  },
  eslintConfigPrettier,
];
