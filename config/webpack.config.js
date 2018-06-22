const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '..')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env'],
			plugins: [[
			  'transform-react-jsx', {
				'pragma': 'Cute.createElement'
			  }
			],
			  'transform-object-rest-spread'
			]
          }
        }
      }
    ]
  }
};
