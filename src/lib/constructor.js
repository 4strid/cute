function Constructor (plan) {
	const prototype = Object.create(Constructor.prototype)
	// attach methods from plan
	prototype.render = plan.render
	// attach State functions from plan
	function constructor (props) {
		// put object in Screen
		// run Ready state
		this.props = props
		this.x = props.x
		this.y = props.y
		this.w = props.w
		this.h = props.h
	}
	constructor.prototype = prototype

	return constructor
}

Constructor.prototype = {
	_render (ctx) {
		ctx.save()
		//ctx.rotate
		//ctx.scale
		ctx.translate(this.x, this.y)
		this.render.call(this)(ctx)
		// or this.draw.call(this, ctx)
		ctx.restore()
	},
}

//Constructor.prototype.constructor = Constructor

export default Constructor
