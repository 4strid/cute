function Rect (x, y, w, h) {
	const rect = Object.create(Rect.prototype)

	;['x', 'y', 'w', 'h'].forEach((k, i) => {
		Object.defineProperty(rect, k, {
			enumerable: true,
			configurable: true,
			writable: false,
			value: arguments[i],
		})
	})
}
Rect.prototype.constructor = Rect

Object.defineProperty(Rect.prototype, 'width', {
	enumerable: false,
	configurable: true,
	get () {
		return this.w
	},
	set (val) {
		return this.w = val
	},
})

Object.defineProperty(Rect.prototype, 'height', {
	enumerable: false,
	configurable: true,
	get () {
		return this.h
	},
	set (val) {
		return this.h = val
	},
})

Rect.prototype.perimeter = function () {
	return (this.w * 2) + (this.h * 2)
}

Rect.prototype.area = function () {
	return this.w * this.h
}

module.exports = Rect
