const path = require('path');

module.exports = {
  entry: './src/lib/cute.js',
  mode: 'production',
  output: {
    filename: 'cute.js',
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
