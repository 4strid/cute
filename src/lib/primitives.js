function drawChildren(props, ctx) {
	if (props.children !== undefined) {
		for (const childNode of props.children) {
			childNode.draw(ctx)
		}
	}
}

const primitives = {
	/*
	 * renders its children and does nothing else
	 */
	layer(props) {
		return ctx => {
			ctx.save()
			drawChildren(props, ctx)
			ctx.restore()
		}
	},
	path(props) {
		return ctx => {
			ctx.save()
			ctx.beginPath()
			drawChildren(props, ctx)
			ctx.restore()
		}
	},
	line(props) {
		return ctx => {
			ctx.save()
			ctx.lineTo(props.x, props.y)
			ctx.restore()
		}
	},
	move(props) {
		return ctx => {
			ctx.save()
			ctx.moveTo(props.x, props.y)
			ctx.restore()
		}
	},
	'arc-to'(props) {
		return ctx => {
			ctx.save()
			ctx.arcTo(props.x1, props.y1, props.x2, props.y2, props.r)
			ctx.restore()
		}
	},
	'close-path'(props) {
		return ctx => {
			ctx.save()
			ctx.closePath()
			ctx.restore()
		}
	},
	/*
	 * creates a rectangular path for stroking/filling
	 * calls ctx.rect() then renders any children
	 */
	rect(props) {
		return ctx => {
			ctx.rect(0, 0, props.w, props.h)
			drawChildren(props, ctx)
		}
	},
	/*
	 * creates an arc path for stroking/filling
	 * calls ctx.arc() then renders any children
	 */
	arc(props) {
		return ctx => {
			ctx.arc(0, 0, props.r, props.sa, props.ea, props.ccw)
		}
	},
	/*
	 * fills its enclosing path
	 * calls ctx.fill()
	 */
	fill(props) {
		return ctx => {
			ctx.save()
			if (props.color) {
				ctx.fillStyle = props.color
			}
			ctx.fill()
			drawChildren(props, ctx)
			ctx.restore()
		}
	},

	stroke(props) {
		return ctx => {
			ctx.save()
			if (props.color) {
				ctx.strokeStyle = props.color
			}
			ctx.stroke()
			drawChildren(props, ctx)
			ctx.restore()
		}
	},

	'fill-rect'(props) {
		return ctx => {
			ctx.save()
			if (props.color) {
				ctx.fillStyle = props.color
			}
			ctx.fillRect(0, 0, props.w, props.h)
			drawChildren(props, ctx)
			ctx.restore()
		}
	},

	nothing() {
		return () => { }
	},

	/*
	 * looks up primitive by name and returns a function that takes props
	 * this in turn returns a function that takes the canvas context and
	 * draws the primitive to the screen
	 */
	_lookup(name) {
		if (!(name in this)) {
			throw new TypeError('Unrecognized primitive type: ' + name)
		}
		return this[name]
	},
}

export default primitives
