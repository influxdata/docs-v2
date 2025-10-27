import globals from 'globals';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import a11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Base configurations
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        // Hugo-specific globals
        hugo: 'readonly',
        params: 'readonly',
        // Common libraries used in docs
        Alpine: 'readonly',
        CodeMirror: 'readonly',
        d3: 'readonly',
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },

  // JavaScript config (extract rules only)
  {
    rules: { ...pluginJs.configs.recommended.rules },
  },

  // TypeScript configurations with proper plugin format
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: { ...tseslint.configs.recommended.rules },
  },

  // Import plugin with proper plugin format
  {
    plugins: {
      import: importPlugin,
    },
    rules: { ...importPlugin.configs.recommended.rules },
  },

  // Accessibility rules with proper plugin format
  {
    plugins: {
      'jsx-a11y': a11yPlugin,
    },
    rules: { ...a11yPlugin.configs.recommended.rules },
  },

  // Add to your config array:
  {
    plugins: {
      jsdoc: jsdocPlugin,
    },
    rules: {
      'jsdoc/require-description': 'warn',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns-description': 'warn',
      // Add more JSDoc rules as needed
    },
  },

  // Prettier compatibility (extract rules only)
  {
    rules: { ...prettierConfig.rules },
  },

  // Custom rules for documentation project
  {
    rules: {
      // Documentation projects often need to use console for examples
      'no-console': 'off',

      // Module imports
      'import/extensions': ['error', 'ignorePackages'],
      'import/no-unresolved': 'off', // Hugo handles module resolution differently

      // Code formatting
      'max-len': ['warn', { code: 80, ignoreUrls: true, ignoreStrings: true }],
      quotes: ['error', 'single', { avoidEscape: true }],

      // Hugo template string linting (custom rule)
      'no-template-curly-in-string': 'off', // Allow ${} in strings for Hugo templates

      // Accessibility
      'jsx-a11y/anchor-is-valid': 'warn',
    },
  },

  // Configuration for Node.js helper scripts
  {
    files: ['helper-scripts/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        // Claude Code environment globals
        Task: 'readonly', // Available when run by Claude Code
      },
    },
    rules: {
      // Node.js specific rules
    },
  },

  // Configuration for specific file patterns
  {
    files: ['**/*.js'],
    rules: {
      // Rules specific to JavaScript files
    },
  },
  {
    files: ['assets/js/**/*.js'],
    rules: {
      // Rules specific to JavaScript in Hugo assets
      // Prevent imports from debug-helpers.js
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: './utils/debug-helpers.js',
              message:
                'Remove debugging functions before committing. Debug helpers should not be used in production code.',
            },
            {
              name: '/utils/debug-helpers.js',
              message:
                'Remove debugging functions before committing. Debug helpers should not be used in production code.',
            },
          ],
        },
      ],
      // Prevent use of debug functions in production code
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name=/^debug(Log|Break|Inspect)$/]',
          message:
            'Remove debugging functions before committing. Debug helpers should not be used in production code.',
        },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // Ignore rules for build files and external dependencies
    ignores: [
      '**/node_modules/**',
      '**/public/**',
      '**/resources/**',
      '**/dist/**',
      '**/.hugo_build.lock',
    ],
  },
];
