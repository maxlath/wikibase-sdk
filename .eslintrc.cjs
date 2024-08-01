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
    '@stylistic/ts',
  ],
  extends: [
    // See https://github.com/standard/eslint-config-standard/blob/master/eslintrc.json
    'standard',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'array-bracket-spacing': [ 'error', 'always' ],
    'arrow-parens': [ 'error', 'as-needed' ],
    'comma-dangle': 'off',
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
    indent: [ 'error', 2, { MemberExpression: 'off' } ],
    'no-var': [ 'error' ],
    // Primarily to avoid false positive with interfaces declarations
    // See https://github.com/typescript-eslint/typescript-eslint/issues/1262
    'no-use-before-define': 'off',
    'nonblock-statement-body-position': [ 'error', 'beside' ],
    'object-curly-spacing': 'off',
    'object-shorthand': [ 'error', 'properties' ],
    'prefer-arrow-callback': [ 'error' ],
    'prefer-const': [ 'error' ],
    'prefer-rest-params': 'off',
    semi: 'off',
    '@stylistic/ts/type-annotation-spacing': 'error',
    '@stylistic/ts/space-infix-ops': 'error',
    '@stylistic/ts/object-curly-spacing': [ 'error', 'always' ],
    '@stylistic/ts/comma-dangle': [ 'error', 'always-multiline' ],
    '@stylistic/ts/keyword-spacing': 'error',
    '@stylistic/ts/indent': [ 'error', 2, { MemberExpression: 'off' } ],
    '@stylistic/ts/member-delimiter-style': [ 'error', { multiline: { delimiter: 'none' }, singleline: { delimiter: 'comma', requireLast: false } } ],
    '@stylistic/ts/semi': [ 'error', 'never' ],
    '@typescript-eslint/ban-ts-comment': [ 'error', {
      'ts-expect-error': 'allow-with-description',
      'ts-nocheck': false,
    } ],
    '@typescript-eslint/consistent-type-imports': [ 'error', { prefer: 'type-imports' } ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
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
