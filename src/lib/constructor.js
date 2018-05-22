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
			this.node.scheduleRender()
		}
	}

	function Component (props, node) {
		this.props = props
		this.node = node

		// set up data handlers
		const data = this.plan.data()
		// set initial positional values
		Object.assign(data, {
			x: props.x || plan.x || 0,
			y: props.y || plan.y || 0,
			w: props.w || plan.w || 0,
			h: props.h || plan.h || 0,
		})
		this.data = {}
		for (const k in data) {
			Object.defineProperty(this.data, k, {
				enumerable: true,
				writable: true,
				get () {
					return data[k]
				},
				set (val) {
					if (val !== data[k]) {
						data[k] = val
						this.node.scheduleRender()
					}
				},
			})
		}

		// TODO: handle async loading, then call start state when ready

		let startState = 'Ready'
		if (props.state) {
			startState = props.state.name
		}

		this.state = new State(startState, this)

		if (this[startState] !== undefined) {
			this[startState]()
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
	unlisten (evtype) {
		this.node.removePersistentListener(this, evtype)
	},
	_receiveProps (props) {
		for (const k in props) {
			// if props have changed, schedule a render
			if (this.props[k] !== props[k]) {
				this.props[k] = props[k]
				this.node.scheduleRender()
			}
		}
		for (const k of ['x', 'y', 'w', 'h']) {
			if (props[k] !== undefined && props[k] !== this[k]) {
				// implicitly calls data.k = props[k], which will cause a rerender if it is different
				this[k] = props[k]
			}
		}
		// if state has changed, call the state transition function
		// this implicitly schedules a render
		if (props.state && this.state.name !== props.state.name) {
			this[props.state.name]()
		}
	},
}

// attach x, y, w, h convenience getters and setters
// these are common among all components so we attach them to Constructor.prototype
for (const k of ['x', 'y', 'w', 'h']) {
	Object.defineProperty(Constructor.prototype, k, {
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
