const internalPaths = [
  '@Configs/**',
  '@Components/**',
  '@Modules/**',
  '@/**',
];

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  ignorePatterns: ['.eslintrc.js'],
  plugins: [
    '@typescript-eslint',
    'react',
    'jsx-a11y',
    'import',
    'react-hooks',
    'prettier',
  ],
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  globals: {
    ga: false,
    React: false,
  },
  env: {
    jest: true,
    browser: true,
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  reportUnusedDisableDirectives: true,
  rules: {
    strict: 'error',
    curly: ['error', 'multi-line', 'consistent'],
    // prettier handles it
    '@typescript-eslint/comma-dangle': 0,
    // prettier handles it
    '@typescript-eslint/indent': 0,
    'react/jsx-props-no-spreading': 0,
    // prettier handles it
    'react/jsx-curly-newline': 0,
    'react/jsx-fragments': 'warn',
    '@typescript-eslint/no-throw-literal': 'warn',
    // prettier handles it
    '@typescript-eslint/quotes': 0,
    'react/static-property-placement': 0,
    'jsx-a11y/no-noninteractive-tabindex': 0,
    'jsx-a11y/interactive-supports-focus': 0,
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 0,
    'linebreak-style': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'prettier/prettier': 'error',
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/react-in-jsx-scope': 0,
    'import/no-unresolved': 2,
    'import/extensions': 2,
    'import/namespace': 0,
    'import/no-cycle': 0,
    'react/button-has-type': 0,
    'react/jsx-wrap-multilines': 0,
    /* no-named-as-default is disabled because
     * this project exports redux components as default
     * and the same component without redux as named property
     * */
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'jsx-a11y/label-has-for': 0,
    'react/destructuring-assignment': 0,
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref'],
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/jest.*.js',
          '**/*.spec.*',
          'specs/**/*.*',
          'stories/**/*.*',
          '**/*.stories.*',
          'gulpfile.js',
          'dangerfile.js',
        ],
      },
    ],
    'import/order': [
      'error',
      {
        pathGroups: internalPaths.map(path => ({
          pattern: path,
          group: 'internal',
        })),
        groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        alphabetize: { order: 'ignore' },
      },
    ],
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': 0,
    'class-methods-use-this': 0,
    'import/prefer-default-export': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useAnimationFrame)',
      },
    ],
    'no-restricted-globals': 'off',
    'jsx-a11y/media-has-caption': 0,
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        labelComponents: ['Label'],
        labelAttributes: ['label'],
        controlComponents: ['Radio', 'RadioBox', 'MaskedInput'],
        depth: 3,
      },
    ],
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],

    // warnings to improve tests
    'testing-library/prefer-screen-queries': 'warn',
    'testing-library/prefer-presence-queries': 'warn',
    'jest-dom/prefer-in-document': 'warn',

    'jest/no-disabled-tests': 'warn',
    'jest/expect-expect': 'error',
    'jest/no-identical-title': 'off',
  },
};
