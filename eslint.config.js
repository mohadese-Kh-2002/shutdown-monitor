import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'release', 'node_modules']),
  
 
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: { 
        ecmaFeatures: { 
          jsx: true 
        } 
      },
    },
    rules: {
      'react-refresh/only-export-components': 'warn',
      'no-undef': 'error',
    },
  },
  

  {
    files: ['electron/**/*.js', 'preload/**/*.js', '*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
    
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off', 
    },
  },
  
 
  {
    files: ['vite.config.js', '*.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
])