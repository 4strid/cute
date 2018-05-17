function Constructor (plan) {
	const prototype = Object.create(Constructor.prototype)

	// attach render function
	prototype.render = plan.render
	// attach methods from plan
	for (const method in plan.methods) {
		prototype[method] = plan.methods[method]
	}
	// attach State transitions from plan
	for (const state in plan.states) {
		prototype[state] = function () {
			this.node.removeEventListeners()
			this.state.set(state)
			plan.states[state].call(this)
		}
	}

	// attach x, y, w, h convenience getters and setters
	for (const k of ['x', 'y', 'w', 'h']) {
		Object.defineProperty(prototype, k, {
			enumerable: true,
			writable: true,
			get () {
				return this.data[k]
			},
			set (val) {
				this.data[k] = val
				return val
			},
		})
	}

	function Component (props, node) {
		this.props = props
		this.node = node
		this.x = props.x
		this.y = props.y
		this.w = props.w
		this.h = props.h

		const data = this.plan.data()

		// handle async loading, then call Ready when ready

		this.state = new State('Ready', this)
		if (this.Ready !== undefined) {
			this.Ready()
		}
	}
	Component.prototype = prototype

	return Component
}

Constructor.prototype = {
	on (evtype, handler) {
		this.node.addEventListener(this, evtype, handler)
	},
	listen (evtype, handler) {
		this.node.addPersistentListener(this, evtype, handler)
	},
}

function State (name, component) {
	return {
		[name]: true,
		name,
		component,
		stack: [],
	}
}

State.prototype.set = function (name) {
	this[this.name] = false
	this[name] = true
	this.name = name
}

State.prototype.save = function () {
	this.stack.push(this.name)
}

State.prototype.restore = function () {
	const name = this.stack.pop()
	if (name === undefined) {
		throw new ReferenceError('Tried to restore state with no states on the stack')
	}
	this.component[name]()
}

//Constructor.prototype.constructor = Constructor

export default Constructor
