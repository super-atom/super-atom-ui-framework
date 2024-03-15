const path = require('path');
const postcssUrl = require('postcss-url');
const postcssPresetEnv = require('postcss-preset-env');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssCascadeLayers = require('@csstools/postcss-cascade-layers');
const postcssSortMediaQueries = require('postcss-sort-media-queries');
const postcssSass = require('@csstools/postcss-sass');
const postcssCustomSelectors = require('postcss-custom-selectors');
const postcssGlobalData = require('@csstools/postcss-global-data');

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
      postcssSass(),
      postcssUrl(),
      postcssPresetEnv({
        stage: 0,
        insertBefore: {
          'all-property': postcssSimpleVars,
        },
      }),
      postcssCascadeLayers({ onImportLayerRule: 'warn' }),
      postcssSortMediaQueries(),
      postcssGlobalData({
        files: [
          './src/styles/custom-selectors.scss'
        ]
      }),
      postcssCustomSelectors(),
      'postcss-advanced-variables',
      'autoprefixer'
    ],
  };
};
