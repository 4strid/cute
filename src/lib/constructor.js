function Constructor (plan) {
	const prototype = Object.create(Constructor.prototype)
	// attach methods from plan
	prototype.render = plan.render
	// attach State transitions from plan
	function Component (props, node) {
		// run Ready state
		this.props = props
		this.node = node
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
