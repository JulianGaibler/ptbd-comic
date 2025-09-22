import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import ts from 'typescript-eslint'
import svelte from 'eslint-plugin-svelte'
import svelteConfig from './svelte.config.js'
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  // js
  js.configs.recommended,
  // ts
  ts.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    languageOptions: {
      parserOptions: {},
    },
  },
  // svelte
  ...svelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        parser: ts.parser,
        svelteConfig: svelteConfig,
      },
    },
  },
  {
    rules: {
      'svelte/no-at-html-tags': 'off',
    },
  },
  ...eslintPluginAstro.configs['flat/recommended'],
  prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
        ...globals.browser,
        $$Generic: 'readonly',
        // Astro globals
        ImageMetadata: 'readonly',
        Astro: 'readonly',
      },
    },
    ignores: ['**/*.config.js'],
  },
  {
    files: ['**/*.stories.svelte'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/generated/graphql.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
