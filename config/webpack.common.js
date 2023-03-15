const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const PATH = require('../config/path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    print: './src/print.js',
  },
  target: ['web', 'es5'],
  output: {
    path: PATH.dist,
    filename: '[name].bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.html', '.js', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          // adding a hash to the file
          filename: '[name].[hash][ext]',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024, // 50kb
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
    new WebpackManifestPlugin()
  ],
};
