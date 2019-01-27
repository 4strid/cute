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
	arc (props) {
		return ctx => {
			ctx.arc(0, 0, props.r, props.sa, props.ea, props.ccw)
		}
	},

	/*
	 * Creates an arc from two specified points (props.x1, props.y1) and (props.x2, props.y2).
	 * Amount of curvature is given by radius props.r 
	 */
	'arc-to' (props) {
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
	'bezier-curve' (props) {
		return ctx => {
			ctx.save()
			ctx.bezierCurveTo(props.cp1x, props.cp1y, props.cp2x, props.cp2y, props.x, props.y)
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

	'fill-rect' (props) {
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
   * wrapper for 2D context drawImage method. You don't have to remember the order of the params lol
   * image MUST be already loaded before calling this method
   */ 
  image (props) {
    console.log(props)
    return ctx => {
      const { img, x: dx, y: dy, dw, dh, sx, sy, sw, sh } = props
      // ez way to make sure they're all defined
      if (!Number.isNaN(sx + sy + sw + sh + dw + dh)) {
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
      } else if (!Number.isNaN(dw + dh)) {
        ctx.drawImage(img, dx, dy, dw, dh)
      } else {
        ctx.drawImage(img, dx, dy)
      }
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
    return () => { ; }
	},

	/*
	 * begins path, then draws children
	 */
	path (props) {
		return ctx => {
			ctx.save()
			ctx.beginPath()
      if (props.fill) ctx.fillStyle = props.fill
      if (props.stroke) ctx.strokeStyle = props.stroke
			drawChildren(props, ctx)
      if (props.close) ctx.closePath()
			ctx.restore()
		}
	},

	/*
	 * Creates a quadratic curve from current point in path to (props.x, props.y)
	 * First coordinates (props.cpx, props.cpy) will designate the control point.
	 */
	'quad-curve' (props) {
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

  'text-style' (props) {
    const { font, textAlign, textBaseline, direction } = props.style || props
    ctx.save()
    if (font) { ctx.font = font }
    if (textAlign) { ctx.textAlign = textAlign }
    if (textBaseline) { ctx.textBaseline = textBaseline }
    if (direction) { ctx.direction = direction }
    drawChildren(props, ctx)
    ctx.restore()
  },

  text (props) {
    let { fill } = props
    const { stroke, w: maxwidth, children } = props
    const { font, textAlign, textBaseline, direction } = props.style || props
    return ctx => {
      let { text } = props
      text = text || ''
      if (children && children.length) {
        text += children.map(c => c.text).join('\n')
      }

      if (!fill && !stroke) {
        fill = true
      }
      ctx.save()
      if (font) { ctx.font = font }
      if (textAlign) { ctx.textAlign = textAlign }
      if (textBaseline) { ctx.textBaseline = textBaseline }
      if (direction) { ctx.direction = direction }
      if (typeof fill === 'string') ctx.fillStyle = fill 
      if (fill)  ctx.fillText(text, 0, 0, maxwidth) 
      if (typeof stroke === 'string') ctx.fillStyle = stroke
      if (stroke)  ctx.strokeText(text, 0, 0, maxwidth)
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
  p (props) {
    return <nothing />
  },
  curve (props) {
    const [pts, rest] = props.children.reduce((ac, c) => isCP(c) ? ac[0].push(c) : ac[1].push(c), [[],[]])

    if (!props.children || !props.children.length || props.children.length > 3) {
      throw new RangeError('A curve must have between 1 and 3 <cp> (control point) children.')
    }

    return (
      <path stroke={props.stroke}>
      {/* ['line-to', 'quadraticCurveTo', 'bezierCurveTo'].map((curve, i))pts.length === 1 && pts[0].type === shapes.cp => (
        <line-to x={pts[0].x} y={pts[0].y} />
      )*/}
      { [...rest] }
      </path>
    )
  },
  circle (props) {
    return (
      <path fill={props.fill} stroke={props.stroke}>
        <arc r={props.r} sa={0} ea={PIx2} ccw={1} children={props.children} />
      </path>
    )
  },
  rectangle (props) {
    return (
      <path fill={props.fill} stroke={props.stroke}>
        <rect w={props.w} h={props.h} children={props.children} />
      </path>
    )
  },
  square (props) {
    return (
      <path fill={props.fill} stroke={props.stroke}>
        <rect w={props.s || props.w} h={props.s || props.w} children={props.children} />
      </path>
    )
  },
}

function isCP (item) {
  return item.type === shapes.cp
}

export default {
  ...primitives,
  ...shapes,
}
