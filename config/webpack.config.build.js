const path = require('path');
const common = require('./webpack.common.js')

module.exports = {
  ...common,
  entry: './src/lib/cute.js',
  mode: 'development',
  output: {
    filename: 'testbed/cute.js',
    path: path.resolve(__dirname, '..'),
  },
};
