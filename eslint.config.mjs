import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import a11yPlugin from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Base configurations
  { 
    languageOptions: { 
      globals: {
        ...globals.browser,
        // Hugo-specific globals
        hugo: "readonly",
        params: "readonly",
        // Common libraries used in docs
        Alpine: "readonly",
        CodeMirror: "readonly",
        d3: "readonly"
      },
      ecmaVersion: 2022,
      sourceType: "module",
    }
  },
  pluginJs.configs.recommended,
  
  // TypeScript configurations (for .ts files)
  ...tseslint.configs.recommended,
  
  // Import plugin for better import/export handling
  importPlugin.configs.recommended,
  
  // Accessibility rules (helpful for docs site)
  a11yPlugin.configs.recommended,
  
  // Prettier compatibility
  prettierConfig,
  
  // Custom rules for documentation project
  {
    rules: {
      // Documentation projects often need to use console for examples
      "no-console": "off",
      
      // Module imports
      "import/extensions": ["error", "ignorePackages"],
      "import/no-unresolved": "off", // Hugo handles module resolution differently
      
      // Code formatting
      "max-len": ["warn", { "code": 80, "ignoreUrls": true, "ignoreStrings": true }],
      "quotes": ["error", "single", { "avoidEscape": true }],
      
      // Documentation-specific
      "valid-jsdoc": ["warn", {
        "requireReturn": false,
        "requireReturnType": false,
        "requireParamType": false
      }],
      
      // Hugo template string linting (custom rule)
      "no-template-curly-in-string": "off", // Allow ${} in strings for Hugo templates
      
      // Accessibility
      "jsx-a11y/anchor-is-valid": "warn",
    }
  },
  
  // Configuration for specific file patterns
  {
    files: ["**/*.js"],
    rules: {
      // Rules specific to JavaScript files
    }
  },
  {
    files: ["assets/js/**/*.js"],
    rules: {
      // Rules specific to JavaScript in Hugo assets
    }
  },
  {
    files: ["**/*.ts"],
    rules: {
      // Rules specific to TypeScript files
    }
  },
  {
    // Ignore rules for build files and external dependencies
    ignores: [
      "**/node_modules/**",
      "**/public/**",
      "**/resources/**",
      "**/.hugo_build.lock"
    ]
  }
];