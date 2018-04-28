function Constructor (plan) {
	const prototype = Object.create(Constructor.prototype)
	// attach methods from plan
	prototype.render = plan.render
	// attach State functions from plan
	function Component (props) {
		// put object in Screen
		// run Ready state
		this.props = props
		this.x = props.x
		this.y = props.y
		this.w = props.w
		this.h = props.h

		this.handlers = {}

		if (plan.states.Ready) {
			plan.states.Ready.call(this)
		}
	}
	Component.prototype = prototype

	return Component
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
	on (evtype, handler) {
		this.handlers[evtype] = handler
	},
	handleEvent (evtype, evt, global) {
		if (global === true) {
			evtype += 'G'
		}
		if (evtype in this.handlers) {
			this.handlers[evtype].call(this, evt)
		}
	},
}

//Constructor.prototype.constructor = Constructor

export default Constructor
