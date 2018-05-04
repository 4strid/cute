import { renderElement } from './util'

const primitives = {
	/*
	 * renders its children and does nothing else
	 */
	group (ctx, props) {
		this._renderChildren(ctx, props)
	},
	/*
	 * creates a rectangular path for stroking/filling
	 * calls ctx.rect() then renders any children
	 */
	rect (ctx, props) {
		ctx.beginPath()
		ctx.rect(props.x, props.y, props.w, props.h)
		this._renderChildren(ctx, props)
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
		const render = props => {
			// attach children to render function so they can be added to the screen
			if (props.children) {
				render.children = props.children
			}
			return ctx => {
				ctx.save()
				this[name](ctx, props)
				ctx.restore()
			}
		}
		return render
	},
	/*
	 * utility function for rendering children
	 */
	_renderChildren (ctx, props) {
		for (const child of props.children) {
			renderElement(ctx, child)
		}
	},
}

export default primitives
