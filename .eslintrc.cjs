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
  extends: [
    // See https://github.com/standard/eslint-config-standard/blob/master/eslintrc.json
    'standard',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'array-bracket-spacing': [ 'error', 'always' ],
    'arrow-parens': [ 'error', 'as-needed' ],
    'comma-dangle': 'off',
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
    'indent': 'off',
    '@typescript-eslint/indent': [ 'error', 2, { MemberExpression: 'off' } ],
    'no-var': [ 'error' ],
    // Primarily to avoid false positive with interfaces declarations
    // See https://github.com/typescript-eslint/typescript-eslint/issues/1262
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'nonblock-statement-body-position': [ 'error', 'beside' ],
    'object-curly-spacing': 'off',
    '@typescript-eslint/object-curly-spacing': [ 'error', 'always' ],
    'object-shorthand': [ 'error', 'properties' ],
    'prefer-arrow-callback': [ 'error' ],
    'prefer-const': [ 'error' ],
    'prefer-rest-params': 'off',
    '@typescript-eslint/ban-ts-comment': [ 'error', {
      'ts-expect-error': false, // TODO: "allow-with-description",
      'ts-nocheck': false,
    } ],
    '@typescript-eslint/consistent-type-imports': [ 'error', { prefer: 'type-imports' } ],
    '@typescript-eslint/no-explicit-any': 'off',
    semi: 'off',
    '@typescript-eslint/semi': [ 'error', 'never' ],
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
