function drawChildren(props, ctx) {
	if (props.children !== undefined) {
		for (const childNode of props.children) {
			childNode.draw(ctx)
		}
	}
}

const primitives = {
	/*
	 * creates an arc path for stroking/filling
	 * calls ctx.arc() then renders any children
	 */
	arc(props) {
		return ctx => {
			ctx.save()
			ctx.arc(0, 0, props.r, props.sa, props.ea, props.ccw)
			drawChildren(props, ctx)
			ctx.restore()
		}
	},
	/*
	 * Creates an arc from two specified points (props.x1, props.y1) and (props.x2, props.y2).
	 * Amount of curvature is given by radius props.r 
	 */
	'arc-to'(props) {
		return ctx => {
			ctx.save()
			ctx.arcTo(0, 0, props.x2 - props.x, props.y2 - props.y, props.r)
			drawChildren(props, ctx)
			ctx.restore()
		}
	},
	/*
	 * Creates a bezier curve from current point in path to (props.x, props.y)
	 * First coordinates (props.cp1x, props.cp1y) will designate the first control point closest to current point.
	 * Second coordinates (props.cp2x, props.cp2y) will designate the second control point, furtheres to current point.
	 */
	'bezier-curve'(props) {
		return ctx => {
			ctx.save()
			ctx.bezierCurveTo(props.cp1x - props.x, props.cp1y - props.y, props.cp2x - props.x, props.cp2y - props.y, 0, 0)
			drawChildren(props, ctx)
			ctx.restore()
		}
	},
	/*
	 * Clears rectangle
	 */
	'clear-rect'(props) {
		return ctx => {
			ctx.save()
			ctx.clearRect(0, 0, props.w, props.h);
			ctx.restore()
		}
	},
	/*
	 * Closes a drawing path, must be placed before a stroke
	 */
	'close-path'(props) {
		return ctx => {
			drawChildren(props, ctx)
			ctx.closePath()
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
	/*
	 * Creates a straight line from current point in path to (props.x, props.y)
	 */
	line(props) {
		return ctx => {
			ctx.save()
			ctx.lineTo(0, 0)
			drawChildren(props, ctx)
			ctx.restore()
		}
	},
	/*
 	 * Moves from current point in path to new point specified by (0.x, props.y)
	 */
	move(props) {
		return ctx => {
			ctx.save()
			ctx.moveTo(0, 0)
			drawChildren(props, ctx)
			ctx.restore()
		}
	},
	nothing() {
		return () => { }
	},
	/*
	 * begins path, then draws children
	 */
	path(props) {
		return ctx => {
			ctx.save()
			ctx.beginPath()
			drawChildren(props, ctx)
			ctx.restore()
		}
	},
	/*
	 * Creates a quadratic curve from current point in path to (props.x, props.y)
	 * First coordinates (props.cpx, props.cpy) will designate the control point.
	 */
	'quad-curve'(props) {
		return ctx => {
			ctx.save()
			ctx.quadraticCurveTo(props.cpx - props.x, props.cpy - props.y, 0, 0)
			drawChildren(props, ctx)
			ctx.restore()
		}
	},
	/*
	 * creates a rectangular path for stroking/filling
	 * calls ctx.rect() then renders any children
	 */
	rect(props) {
		return ctx => {
			ctx.save()
			ctx.rect(0, 0, props.w, props.h)
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
