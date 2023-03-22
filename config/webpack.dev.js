const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const PATH = require('./path');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const baseConfig = require('./webpack.common.js');
const ENV = require('./env');

const { cssLoaders } = require('./util');

module.exports = merge(common, {
  mode: 'development',
  stats: {
    warnings: false,
  },

  devtool: 'inline-source-map',
  target: 'web',
  devServer: {
    // devMiddleware: {
    //   writeToDisk: true,
    // },
    client: {
      overlay: {
        errors: false,
        warnings: false,
      },
    },
    static: {
      directory: path.join(__dirname, '../dist'),
      publicPath: '/',
      watch: true,
    },
    compress: true,
    port: 9000,
    open: true,
    port: ENV.server.port,
    liveReload: true,
    hot: true,
    host: 'localhost',
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 300,
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: ['style-loader', ...cssLoaders],
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      emitWarning: true,
      files: path.resolve(__dirname, '../src'),
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
    }),
    // new BundleAnalyzerPlugin(),
  ],
});
