module.exports = {
    "env": {
	  "browser": true,
	  "node": true,
      "es6": true
    },
	"parser": "babel-eslint",
	"extends": [
		"eslint:recommended",
	],
	"plugins": [
		"babel",
		"react",
	],
    "parserOptions": {
        "sourceType": "module",
		"ecmaVersion": 2017,
		"ecmaFeatures": {
			"experimentalObjectRestSpread": true,
			"jsx": true
		}
    },
	"settings": {
		"react": {
			"pragma": 'Cute'
		}
	},
    "rules": {
      "indent": [
          1,
          "tab"
      ],
      "linebreak-style": 0,
	  "quotes": [
		  1,
		  "single"
	  ],
      "semi": [
        1,
        "never"
      ],
	  "space-before-function-paren": [1, "always"],
	  "no-unused-vars": [1, {"args": "after-used"}],
	  "comma-dangle": [1, "always-multiline"],
      "no-mixed-spaces-and-tabs": [1, "smart-tabs"],
      "camelcase": 0,
      "no-use-before-define": 0,
      "no-plusplus": 0,
      "consistent-return": 0,
      "no-underscore-dangle": 0,
      "arrow-body-style": 0,
      "no-console": 0,
      "object-curly-spacing": 0,
      "no-multiple-empty-lines": 0,
      "spaced-comment": 0,
	  // react rules we need to borrow
	  "react/jsx-uses-vars": [2],
	  "react/jsx-uses-react": [2],
    }
};
