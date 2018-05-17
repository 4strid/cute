const primitives = {
	/*
	 * renders its children and does nothing else
	 */
	layer (props) {
		return ctx => {
			ctx.save()
			for (const childNode of props.children) {
				childNode.draw(ctx)
			}
			ctx.restore()
		}
	},
	/*
	 * creates a rectangular path for stroking/filling
	 * calls ctx.rect() then renders any children
	 */
	rect (props) {
		return ctx => {
			ctx.save()
			ctx.beginPath()
			ctx.rect(props.x, props.y, props.w, props.h)
			for (const childNode of props.children) {
				childNode.draw(ctx)
			}
			ctx.restore()
		}
	},
	/*
	 * fills its enclosing path
	 * calls ctx.fill()
	 */
	fill (props) {
		return ctx => {
			ctx.save()
			if (props.color) {
				ctx.fillStyle = props.color
			}
			ctx.fill()
			ctx.restore()
		}
	},
	
	'fill-rect' (props) {
		return ctx => {
			ctx.save()
			if (props.color) {
				ctx.fillStyle = props.color
			}
			ctx.fillRect(props.x, props.y, props.w, props.h)
			ctx.restore()
		}
	},

	/*
	 * looks up primitive by name and returns a function that takes props
	 * this in turn returns a function that takes the canvas context and
	 * draws the primitive to the screen
	 */
	_lookup (name) {
		if (!(name in this)) {
			throw new TypeError('Unrecognized primitive type: ' + name)
		}
		return this[name]
	},
}

export default primitives
