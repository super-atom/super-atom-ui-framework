const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const PATH = require('../config/path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const htmlPlugins = generateHtmlPlugins('../src/views/pages');
module.exports = {
  entry: {
    style: './src/js/style.js',
  },
  target: ['web', 'es5'],
  output: {
    path: PATH.dist,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.css', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset',
        generator: {
          filename: 'assets/fonts/[name].[ext]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.hbs$/,
        use: ['handlebars-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },

  plugins: [
    new WebpackManifestPlugin({
      fileName: 'assets.json',
      basePath: '/',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src', to: './' }],
    })
  ].concat(htmlPlugins),
};
function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      minify: false,
      chunks: ['style'],
    });
  });
}
