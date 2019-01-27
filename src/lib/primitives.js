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
			ctx.arc(0, 0, props.r, props.sa, props.ea, props.ccw)
		}
	},
	/*
	 * Creates an arc from two specified points (props.x1, props.y1) and (props.x2, props.y2).
	 * Amount of curvature is given by radius props.r 
	 */
	'arc-to'(props) {
		return ctx => {
			ctx.save()
			ctx.arcTo(props.x1, props.y1, props.x2, props.y2, props.r)
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
			ctx.bezierCurveTo(props.cp1x, props.cp1y, props.cp2x, props.cp2y, props.x, props.y)
			ctx.restore()
		}
	},
	/*
	 * Closes a drawing path, must be placed before a stroke
	 */
	'close-path'(props) {
		return ctx => {
			ctx.save()
			ctx.closePath()
			ctx.restore()
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
			ctx.lineTo(props.x, props.y)
			ctx.restore()
		}
	},
	/*
 	 * Moves from current point in path to new point specified by (props.x, props.y)
	 */
	move(props) {
		return ctx => {
			ctx.save()
			ctx.moveTo(0, 0)
			ctx.restore()
		}
	},
	nothing() {
    return () => {

    } 
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
			ctx.quadraticCurveTo(props.cpx, props.cpy, props.x, props.y)
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

const PIx2 = Math.PI * 2
const TWOPI = PIx2

const shapes = {
  circle (props) {
  return (
    <path fill={props.fill} stroke={props.stroke}>
      <arc r={props.r} sa={0} ea={PIx2} ccw={1} children={props.children} />
    </path>
  )},
  rectangle (props) {
  return (
    <path fill={props.fill} stroke={props.stroke}>
      <rect w={props.w} h={props.h} children={props.children} />
    </path>
  )},
  square (props) {
  return (
    <path fill={props.fill} stroke={props.stroke}>
      <rect w={props.s || props.w} h={props.s || props.w} children={props.children} />
    </path>
  )},
}

export default {
  ...primitives,
  ...shapes,
}
