const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const dev = require('./webpack.dev');
const prod = require('./webpack.prod');

module.exports = (env) => {
  if (env.mode === 'development') {
    return merge(common, dev);
  }

  if (env.mode === 'production') {
    return merge(common, prod);
  }
};
