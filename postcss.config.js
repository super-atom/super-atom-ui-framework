const path = require('path');
const cssnano = require('cssnano');
const postcssUrl = require('postcss-url');
const postcssPresetEnv = require('postcss-preset-env');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssCascadeLayers = require('@csstools/postcss-cascade-layers');
const postcssSortMediaQueries = require('postcss-sort-media-queries');

module.exports = (api) => {
  return {
    parser: 'postcss-scss',
    syntax: 'postcss-scss',
    // !!! 순서가 중요하다.
    plugins: [
      'postcss-import',
      'postcss-mixins',
      'postcss-nested',
      'postcss-reporter',
      'postcss-extend-rule',
      'postcss-flexbugs-fixes',
      postcssUrl(),
      postcssPresetEnv({
        stage: 0,
        insertBefore: {
          'all-property': postcssSimpleVars,
        },
      }),
      postcssCascadeLayers({ onImportLayerRule: 'warn' }),
      postcssSortMediaQueries(),
      'postcss-advanced-variables',
      'lost',
      'autoprefixer',
      api.env === 'production' ? cssnano({ preset: 'default' }): false,
    ],
  };
};
