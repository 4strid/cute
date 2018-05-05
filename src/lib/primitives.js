const primitives = {
	/*
	 * renders its children and does nothing else
	 */
	layer (ctx, props) {
		this._drawChildren(ctx, props)
	},
	/*
	 * creates a rectangular path for stroking/filling
	 * calls ctx.rect() then renders any children
	 */
	rect (ctx, props) {
		ctx.beginPath()
		ctx.rect(props.x, props.y, props.w, props.h)
		this._drawChildren(ctx, props)
	},
	/*
	 * fills its enclosing path
	 * calls ctx.fill()
	 */
	fill (ctx, props) {
		if (props.color) {
			ctx.fillStyle = props.color
		}
		ctx.fill()
	},
	
	'fill-rect' (ctx, props) {
		if (props.color) {
			ctx.fillStyle = props.color
		}
		ctx.fillRect(props.x, props.y, props.w, props.h)
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
		return props => ctx => {
			ctx.save()
			this[name](ctx, props)
			ctx.restore()
		}
	},
	/*
	 * utility function for rendering children
	 */
	_drawChildren (ctx, props) {
		for (const child of props.children) {
			child.draw(ctx)
		}
	},
}

export default primitives
