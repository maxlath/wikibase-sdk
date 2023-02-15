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
    'comma-dangle': [ 'error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    } ],
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
    'object-curly-spacing': [ 'error', 'always' ],
    'object-shorthand': [ 'error', 'properties' ],
    'prefer-arrow-callback': [ 'error' ],
    'prefer-const': [ 'error' ],
    'prefer-rest-params': 'off',
    // See https://typescript-eslint.io/rules/semi/#how-to-use
    semi: 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-imports': [ 'error', { prefer: 'type-imports' } ],
    '@typescript-eslint/no-explicit-any': 'off',
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
