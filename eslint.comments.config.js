import tseslint from 'typescript-eslint';
import noComments from './scripts/eslint/no-comments.js';

export default [
  {
    ignores: ['**/node_modules/**', '**/public/**', '**/resources/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { comments: { rules: { 'no-comments': noComments } } },
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    rules: { 'comments/no-comments': 'error' },
  },
  {
    files: ['**/*.ts'],
    languageOptions: { parser: tseslint.parser },
  },
];
