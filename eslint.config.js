import { globalIgnores } from '@eslint/config-helpers'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
// Using eslint-plugin-import-x rather than eslint-plugin-import
// to get rid of `Unable to resolve path to module '@typescript-eslint/parser'  import/no-unresolved` errors
import importxPlugin from 'eslint-plugin-import-x'
import globals from 'globals'
import ts from 'typescript-eslint'

// Inspect the generated config:
//    npx eslint --inspect-config
// Inspect the config applying to a specific file:
//    eslint --print-config file_to_check.js

const tsParserOptions = {
  tsconfigRootDir: import.meta.dirname,
  // Would be required to enable ts.configs.recommendedTypeChecked and ts.configs.stylisticTypeChecked,
  // but couldn't make it work
  // See https://typescript-eslint.io/blog/project-service/
  // projectService: true,
  allowDefaultProject: [ '*.js' ],
}

export default ts.config([
  js.configs.recommended,
  ...ts.configs.recommended,
  ...ts.configs.stylistic,
  importxPlugin.flatConfigs.recommended,
  importxPlugin.flatConfigs.typescript,
  stylistic.configs.customize({
    braceStyle: '1tbs',
    jsx: false,
  }),
  {
    files: [ 'src/**/*.ts', 'tests/**/*.ts', 'scripts/**/*.ts', '*.js', '*.cjs' ],
    languageOptions: {
      globals: globals.node,
      parser: ts.parser,
      parserOptions: tsParserOptions,
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: './tsconfig.json',
        }),
      ],
    },
    rules: {
      'array-callback-return': 'off',
      eqeqeq: [ 'error', 'smart' ],
      'implicit-arrow-linebreak': [ 'error', 'beside' ],

      // See https://github.com/un-ts/eslint-plugin-import-x#rules
      'import-x/newline-after-import': 'error',
      'import-x/no-named-as-default': 'off',
      'import-x/no-duplicates': 'error',
      'import-x/no-named-as-default-member': 'off',
      'import-x/order': [ 'error', {
        pathGroups: [ {
          pattern: '#*/**',
          group: 'internal',
          position: 'before',
        } ],
        groups: [ 'builtin', 'external', 'internal', 'parent', 'sibling', 'object', 'type' ],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
        },
      } ],

      indent: [ 'error', 2, {
        MemberExpression: 'off',
      } ],

      'no-ex-assign': [ 'off' ],
      'no-var': [ 'error' ],

      // Disable until eslint-plugin-node-import adds support for ESLint 9
      // or `eslint-plugin-import-x` implements `import/enforce-node-protocol-usage`
      // 'node-import/prefer-node-protocol': 2,

      'nonblock-statement-body-position': [ 'error', 'beside' ],
      'object-shorthand': [ 'error', 'properties' ],
      'one-var': [ 'off' ],
      'prefer-arrow-callback': [ 'error' ],
      'prefer-const': [ 'off' ],

      // See https://eslint.style/rules
      '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
      '@stylistic/arrow-parens': [ 'error', 'as-needed' ],
      '@stylistic/brace-style': 'error',
      '@stylistic/comma-dangle': [ 'error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      } ],
      '@stylistic/indent': [ 'error', 2, { MemberExpression: 'off' } ],
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/operator-linebreak': [ 'error', 'after', { overrides: { '?': 'before', ':': 'before' } } ],
      '@stylistic/max-statements-per-line': 'off',
      '@stylistic/member-delimiter-style': [ 'error', {
        multiline: {
          delimiter: 'none',
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false,
        },
      } ],
      '@stylistic/object-curly-spacing': [ 'error', 'always' ],
      '@stylistic/quote-props': [ 'error', 'as-needed' ],
      '@stylistic/quotes': [ 'error', 'single', { avoidEscape: true } ],
      '@stylistic/space-before-function-paren': [ 'error', { anonymous: 'always', asyncArrow: 'always', named: 'always' } ],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/type-annotation-spacing': 'error',
      // Doesn't allow have a space between the function name and the generic type parameters
      '@stylistic/type-generic-spacing': 'off',

      // See https://typescript-eslint.io/rules/
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-imports': [ 'error', { prefer: 'type-imports' } ],
      '@typescript-eslint/no-explicit-any': 'off',
      // -- Type check rules overrides
      // This rules require strict types
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      // Some equivalent types, in particular string types, are worth keeping for the sake of readability
      // until we can introduce tagged types (1)
      '@typescript-eslint/no-duplicate-type-constituents': 'off',
      // Idem
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      // Noisy when doing things such as passing an async function a `setTimeout`
      '@typescript-eslint/no-misused-promises': 'off',
      // We have rather been using String#match until now, which might be more readable
      '@typescript-eslint/prefer-regexp-exec': 'off',
      // Some functions might not call await but conditionally return a promise;
      // making it async allows to normalize the response type to always be a promise
      '@typescript-eslint/require-await': 'off',
      // --
    },
  },
  {
    files: [ './tests/**/*.ts' ],
    languageOptions: {
      globals: {
        it: 'readonly',
        xit: 'readonly',
        describe: 'readonly',
        xdescribe: 'readonly',
        beforeEach: 'readonly',
        before: 'readonly',
      },
      parser: ts.parser,
      parserOptions: tsParserOptions,
    },
  },
  globalIgnores([
    '**/node_modules',
    '**/dist',
  ]),
])

// (1): on tagged types, see https://medium.com/@ethanresnick/advanced-typescript-tagged-types-for-fewer-bugs-and-better-security-24db681d5721)
