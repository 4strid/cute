const path = require('path')

module.exports = {
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
}
