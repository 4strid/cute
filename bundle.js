/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _cute = __webpack_require__(/*! ./lib/cute */ \"./src/lib/cute.js\");\n\nvar _cute2 = _interopRequireDefault(_cute);\n\nvar _Square = __webpack_require__(/*! ./Square */ \"./src/Square.js\");\n\nvar _Square2 = _interopRequireDefault(_Square);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar App = function App() {\n\treturn _cute2.default.createElement(\n\t\t'group',\n\t\tnull,\n\t\t_cute2.default.createElement(_Square2.default, { w: 70, h: 70, x: 0, y: 0, color: '#55ff55' }),\n\t\t_cute2.default.createElement(_Square2.default, { w: 100, h: 100, x: 50, y: 50, color: '#facade' })\n\t);\n};\n\nexports.default = App;\n\n//# sourceURL=webpack:///./src/App.js?");

/***/ }),

/***/ "./src/Square.js":
/*!***********************!*\
  !*** ./src/Square.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _cute = __webpack_require__(/*! ./lib/cute */ \"./src/lib/cute.js\");\n\nvar _cute2 = _interopRequireDefault(_cute);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar Square = _cute2.default.Constructor({\n\trender: function render() {\n\t\treturn _cute2.default.createElement(\n\t\t\t'rect',\n\t\t\t{ w: this.w, h: this.h, x: 0, y: 0 },\n\t\t\t_cute2.default.createElement('fill', { color: this.props.color })\n\t\t);\n\t\t//return (\n\t\t//<fill-rect w={this.w} h={this.h} x={0} y={0} color={this.props.color}/>\n\t\t//)\n\t}\n});\n\nexports.default = Square;\n\n//# sourceURL=webpack:///./src/Square.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _cute = __webpack_require__(/*! ./lib/cute */ \"./src/lib/cute.js\");\n\nvar _cute2 = _interopRequireDefault(_cute);\n\nvar _App = __webpack_require__(/*! ./App */ \"./src/App.js\");\n\nvar _App2 = _interopRequireDefault(_App);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n_cute2.default.attach(_cute2.default.createElement(_App2.default, null), document.getElementsByTagName('canvas')[0]);\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/lib/constructor.js":
/*!********************************!*\
  !*** ./src/lib/constructor.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nfunction Constructor(plan) {\n\tvar prototype = Object.create(Constructor.prototype);\n\t// attach methods from plan\n\tprototype.render = plan.render;\n\t// attach State functions from plan\n\tfunction constructor(props) {\n\t\t// put object in Screen\n\t\t// run Ready state\n\t\tthis.props = props;\n\t\tthis.x = props.x;\n\t\tthis.y = props.y;\n\t\tthis.w = props.w;\n\t\tthis.h = props.h;\n\t}\n\tconstructor.prototype = prototype;\n\n\treturn constructor;\n}\n\nConstructor.prototype = {\n\t_render: function _render(ctx) {\n\t\tctx.save();\n\t\t//ctx.rotate\n\t\t//ctx.scale\n\t\tctx.translate(this.x, this.y);\n\t\tthis.render.call(this)(ctx);\n\t\t// or this.draw.call(this, ctx)\n\t\tctx.restore();\n\t}\n};\n\n//Constructor.prototype.constructor = Constructor\n\nexports.default = Constructor;\n\n//# sourceURL=webpack:///./src/lib/constructor.js?");

/***/ }),

/***/ "./src/lib/cute.js":
/*!*************************!*\
  !*** ./src/lib/cute.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _primitives = __webpack_require__(/*! ./primitives */ \"./src/lib/primitives.js\");\n\nvar _primitives2 = _interopRequireDefault(_primitives);\n\nvar _constructor = __webpack_require__(/*! ./constructor */ \"./src/lib/constructor.js\");\n\nvar _constructor2 = _interopRequireDefault(_constructor);\n\nvar _util = __webpack_require__(/*! ./util */ \"./src/lib/util.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar Cute = {\n\tattach: function attach(RootComponent, canvas) {\n\t\tthis.canvas = canvas;\n\t\tthis.ctx = canvas.getContext('2d');\n\t\t(0, _util.renderElement)(this.ctx, RootComponent);\n\t},\n\tcreateElement: function createElement(Type, props) {\n\t\t//console.log('it\\'s JSX bro')\n\n\t\t// virtual tree .add new element\n\t\t// how to keep track of where we are in the tree? do we have to?\n\t\t// when do we add the children?\n\t\t// could shove this into the Screen, but better not: separation of\n\t\t// concerns\n\n\t\t//console.log(Type)\n\t\t//console.log(props)\n\t\t//console.log(children)\n\n\t\tif (props === null) {\n\t\t\tprops = {};\n\t\t}\n\n\t\tfor (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n\t\t\tchildren[_key - 2] = arguments[_key];\n\t\t}\n\n\t\tprops.children = children;\n\t\t// if Type came from the Cute Constructor\n\t\tif (_constructor2.default.prototype.isPrototypeOf(Type.prototype)) {\n\t\t\treturn new Type(props);\n\t\t}\n\t\tif (Type instanceof Function) {\n\t\t\treturn Type(props);\n\t\t}\n\t\treturn _primitives2.default._lookup(Type)(props);\n\t},\n\n\n\tConstructor: _constructor2.default\n};\n\nexports.default = Cute;\n\n//# sourceURL=webpack:///./src/lib/cute.js?");

/***/ }),

/***/ "./src/lib/primitives.js":
/*!*******************************!*\
  !*** ./src/lib/primitives.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _util = __webpack_require__(/*! ./util */ \"./src/lib/util.js\");\n\nvar primitives = {\n\t/*\r\n  * renders its children and does nothing else\r\n  */\n\tgroup: function group(ctx, props) {\n\t\tthis._renderChildren(ctx, props);\n\t},\n\n\t/*\r\n  * creates a rectangular path for stroking/filling\r\n  * calls ctx.rect() then renders any children\r\n  */\n\trect: function rect(ctx, props) {\n\t\tctx.beginPath();\n\t\tctx.rect(props.x, props.y, props.w, props.h);\n\t\tthis._renderChildren(ctx, props);\n\t},\n\n\t/*\r\n  * fills its enclosing path\r\n  * calls ctx.fill()\r\n  */\n\tfill: function fill(ctx, props) {\n\t\tif (props.color) {\n\t\t\tctx.fillStyle = props.color;\n\t\t}\n\t\tctx.fill();\n\t},\n\t'fill-rect': function fillRect(ctx, props) {\n\t\tif (props.color) {\n\t\t\tctx.fillStyle = props.color;\n\t\t}\n\t\tctx.fillRect(props.x, props.y, props.w, props.h);\n\t},\n\n\n\t/*\r\n  * looks up primitive by name and returns a function that takes props\r\n  * this in turn returns a function that takes the canvas context and\r\n  * draws the primitive to the screen\r\n  */\n\t_lookup: function _lookup(name) {\n\t\tvar _this = this;\n\n\t\treturn function (props) {\n\t\t\treturn function (ctx) {\n\t\t\t\tif (!(name in _this)) {\n\t\t\t\t\tthrow new TypeError('Unrecognized primitive type: ' + name);\n\t\t\t\t}\n\t\t\t\tctx.save();\n\t\t\t\t_this[name](ctx, props);\n\t\t\t\tctx.restore();\n\t\t\t};\n\t\t};\n\t},\n\n\t/*\r\n  * utility function for rendering children\r\n  */\n\t_renderChildren: function _renderChildren(ctx, props) {\n\t\tvar _iteratorNormalCompletion = true;\n\t\tvar _didIteratorError = false;\n\t\tvar _iteratorError = undefined;\n\n\t\ttry {\n\t\t\tfor (var _iterator = props.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n\t\t\t\tvar child = _step.value;\n\n\t\t\t\t(0, _util.renderElement)(ctx, child);\n\t\t\t}\n\t\t} catch (err) {\n\t\t\t_didIteratorError = true;\n\t\t\t_iteratorError = err;\n\t\t} finally {\n\t\t\ttry {\n\t\t\t\tif (!_iteratorNormalCompletion && _iterator.return) {\n\t\t\t\t\t_iterator.return();\n\t\t\t\t}\n\t\t\t} finally {\n\t\t\t\tif (_didIteratorError) {\n\t\t\t\t\tthrow _iteratorError;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n};\n\nexports.default = primitives;\n\n//# sourceURL=webpack:///./src/lib/primitives.js?");

/***/ }),

/***/ "./src/lib/util.js":
/*!*************************!*\
  !*** ./src/lib/util.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nexports.renderElement = undefined;\n\nvar _constructor = __webpack_require__(/*! ./constructor */ \"./src/lib/constructor.js\");\n\nvar _constructor2 = _interopRequireDefault(_constructor);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar renderElement = function renderElement(ctx, element) {\n\tif (element instanceof _constructor2.default) {\n\t\treturn element._render(ctx);\n\t}\n\telement(ctx);\n};\n\nexports.renderElement = renderElement;\n\n//# sourceURL=webpack:///./src/lib/util.js?");

/***/ })

/******/ });