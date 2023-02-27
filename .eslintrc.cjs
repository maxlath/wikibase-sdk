// This config file is used by eslint
// See package.json scripts: lint*
// Rules documentation: https://eslint.org/docs/rules/
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  plugins: [
    '@typescript-eslint',
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  extends: [
    // See https://github.com/standard/eslint-config-standard/blob/master/eslintrc.json
    'standard-with-typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'array-bracket-spacing': [ 'error', 'always' ],
    'arrow-parens': [ 'error', 'as-needed' ],
    '@typescript-eslint/comma-dangle': [ 'error', 'always-multiline' ],
    eqeqeq: [ 'error', 'smart' ],
    'implicit-arrow-linebreak': [ 'error', 'beside' ],
    'import/newline-after-import': 'error',
    'import/order': [
      'error',
      {
        pathGroups: [
          { pattern: '#*/**', group: 'internal', position: 'before' },
        ],
        groups: [ 'builtin', 'external', 'internal', 'parent', 'sibling', 'type' ],
        'newlines-between': 'never',
        alphabetize: { order: 'asc' },
      },
    ],
    '@typescript-eslint/indent': [ 'error', 2, { MemberExpression: 'off' } ],
    'no-var': [ 'error' ],
    'nonblock-statement-body-position': [ 'error', 'beside' ],
    'object-shorthand': [ 'error', 'properties' ],
    'prefer-arrow-callback': [ 'error' ],
    'prefer-rest-params': 'off',

    // TODO remove (= enable these lints and fix the issues)
    '@typescript-eslint/ban-ts-comment': [ 'error', {
      'ts-expect-error': false, // TODO: "allow-with-description",
      'ts-nocheck': false,
    } ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',

    // Enable when strict or strictNullChecks is enabled in tsconfig
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
  },
  globals: {
    // Mocha globals
    it: 'readonly',
    xit: 'readonly',
    describe: 'readonly',
    xdescribe: 'readonly',
    before: 'readonly',
    beforeEach: 'readonly',
  },
}
