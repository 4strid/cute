function Arc(x, y, r, sa, ea, ccw) {
	const arc = Object.create(Arc.prototype)

		;['r', 'sa', 'ea', 'ccw'].forEach((k, i) => {
			Object.defineProperty(arc, k, {
				enumerable: true,
				configurable: true,
				writable: false,
				value: arguments[i],
			})
		})
}
Arc.prototype.constructor = Arc

Object.defineProperty(Arc.prototype, 'radius', {
	enumerable: false,
	configurable: true,
	get() {
		return this.props.r
	},
	set(val) {
		return this.r = val
	},
})

Object.defineProperty(Arc.prototype, 'startAngle', {
	enumerable: false,
	configurable: true,
	get() {
		return this.props.sa
	},
	set(val) {
		return this.props.sa = val
	},
})

Object.defineProperty(Arc.prototype, 'endAngle', {
	enumerable: false,
	configurable: true,
	get() {
		return this.props.ea
	},
	set(val) {
		return this.props.ea = val
	},
})

Object.defineProperty(Arc.prototype, 'counterclockwise', {
	enumerable: false,
	configurable: true,
	get() {
		return this.props.ccw
	},
	set(val) {
		return this.props.ccw = val
	},
})

Arc.prototype.perimeter = function () {
	return 2 * Math.PI * this.props.r
}

//Assuming for now that arc is a perfect circle
Arc.prototype.area = function () {
	return Math.PI * Math.pow(this.props.r, 2)
}

module.exports = Arc
