const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const PATH = require('../config/path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackInjector = require('html-webpack-injector');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const htmlPlugins = generateHtmlPlugins('../src/views/pages');
module.exports = {
  entry: {
    index: './src/js/index.js',
    print: './src/js/print.js',
    style: './src/js/style.js',
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
          filename: '[name].[ext]',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 500 * 1024, // 500kb
          },
        },
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
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery',
      _: 'lodash',
    }),
    new HtmlWebpackInjector(),
    new WebpackManifestPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src', to: './' }],
    })
    // new HtmlWebpackPlugin({
    //   template: 'src/views/templates/template.hbs',
    //   title: 'Main Page',
    //   filename: '../dist/views/index.html',
    //   minify: false,
    //   chunks: ['index', 'print', 'style'],
    // }),
    // new HtmlWebpackPlugin({
    //   template: 'src/views/templates/page-sub.hbs',
    //   title: 'TEST-02',
    //   filename: '../dist/views/TEST-02.html',
    //   minify: false,
    //   chunks: ['index', 'print', 'style'],
    // }),
  ].concat(htmlPlugins),
};
function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    // Split names and extension
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      minify: false,
      chunks: ['index', 'style'],
    });
  });
}


