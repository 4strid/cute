const path = require('path');
const common = require('./webpack.common.js')

module.exports = {
  ...common,
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '..')
  },
  devtool: 'cheap-module-eval-source-map',
};
