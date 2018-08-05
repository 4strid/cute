function Constructor (plan, ...wrappers) {
	const prototype = Object.create(Constructor.prototype)

	console.log(wrappers)

	// attach render function
	if (wrappers.length) {
		let render = plan.render
		for (let i = wrappers.length - 1; i >= 0; i--) {
			const renderFn = render
			render = function () {
				 return wrappers[i].call(this, renderFn.bind(this), this, this.props)
			}
		}
		prototype.render = render
	} else {
		prototype.render = plan.render
	}
	// attach methods from plan
	for (const method in plan.methods) {
		prototype[method] = plan.methods[method]
	}
	// attach State transitions from plan
	for (const state in plan.states) {
		prototype[state] = function () {
			this.node.removeEventListeners(this)
			this.state.set(state)
			plan.states[state].call(this)
		}
	}

	if (plan.update) {
		prototype.update = plan.update
	}

	prototype.destroy = function () {
		if (plan.destroy) {
			plan.destroy.call(this)
		}
	}
	// even this doesn't appear to work in Chrome, the functions are still called ''
	//function nameFunction (name) {
	//	return {[name]: function (props, node) {return construct.call(this, props, node)}}[name]
	//}

	//const Component = nameFunction(plan.displayName || 'Component')

	//console.log(Component.name)
	//console.log(Component)

	prototype.construct = function (props) {
		this.props = {}
		for (const k in props) {
			if (k === 'key' || k === 'ref' || k === 'proxy') {
				continue
			}
			this.props[k] = props[k]
		}
		// pass the transform value up to the node
		props.transform = plan.transform !== false
		// the canonical data object that actually holds the data
		const data = {}

		// set initial positional values
		Object.assign(data, {
			x: props.x || plan.x || 0,
			y: props.y || plan.y || 0,
			w: props.w || plan.w,
			h: props.h || plan.h,
		})

		// proxy data object whose getters and setters allow for automatic rerendering
		this.data = {}

		// do x, y, w, and h first so they're available in the plan.data function
		for (const k in data) {
			Object.defineProperty(this.data, k, {
				enumerable: true,
				configurable: true,
				get () {
					return data[k]
				},
				set: (val) => {
					data[k] = val
					this.node.scheduleRender()
				},
			})
		}

		// allow for moving the component without rerendering it
		for (const k of ['x', 'y']) {
			Object.defineProperty(this, k, {
				enumerable: true,
				configurable: true,
				get () {
					return data[k]
				},
				set: (val) => {
					if (val !== data[k]) {
						data[k] = val
						this.node.scheduleMove()
					}
				},
			})
		}

		if (plan.data) {
			const planData = plan.data.call(this)

			for (const k in planData) {
				data[k] = planData[k]
				Object.defineProperty(this.data, k, {
					enumerable: true,
					configurable: true,
					get () {
						return data[k]
					},
					set: (val) => {
						data[k] = val
						this.node.scheduleRender()
					},
				})
			}
		}

		if (props.proxy) {
			props.proxy((proxied, ...bindings) => {
				this.proxyOf = proxied
				for (const binding of bindings) {
					Object.defineProperty(this, binding, {
						enumerable: true,
						configurable: true,
						get () {
							return proxied[binding]
						},
						set (value) {
							return proxied[binding] = value
						},
					})
				}
			})
		}

		// oh cool, actually the order of events is:
		//  - parent component changes state
		//   > schedules rerender
		//  - child component does not have NewState, so it calls Ready instead
		//  - rerender occurs, child receives NewState
		//
		//  so problem... averted for now
		let startState = 'Ready'
		if (props.state && this[props.state.name]) {
			startState = props.state.name
		}

		this.state = new State(startState, this)
	}

	const constructor = plan.hasOwnProperty('constructor') ? plan.constructor : function Component (props) {
		this.construct(props)
	}

	if (plan.transform === false) {
		constructor.transform = false
	}
	constructor.prototype = prototype
	constructor.prototype.constructor = constructor

	return constructor
}

Constructor.prototype = {
	// listen for a certain evtype. handler is removed upon state change
	on(evtype, handler) {
		this.node.addEventListener(this, evtype, handler)
	},
	// listen for a certain evtype. handler persists through state changes
	listen(evtype, handler) {
		this.node.addPersistentListener(this, evtype, handler)
	},
	// removes a persistent listener
	unlisten(evtype) {
		this.node.removePersistentListener(this, evtype)
	},
	getCollisions() {
		return this.node.getCollisions(this)
	},
	// sets own state to the given name and attempts to call that state function
	setState(name) {
		this.state.set(name)
		if (this[name]) {
			this[name]()
		}
		this.node.scheduleRender()
	},
	_receiveProps(props) {
		for (const k of ['x', 'y', 'w', 'h']) {
			if (props[k] !== undefined && props[k] !== this.props[k]) {
				// call getters / setters to act appropriately
				this[k] = props[k]
			}
		}
		for (const p in props) {
			this.props[p] = props[p]
		}
		//this.props = props

		// if state has changed, call the state transition function
		if (props.state && props.state.isUpdated) {
			this.setState(props.state.name)
		}

	},
}

// attach w, h convenience getters and setters
// w and h should trigger a rerender
// these are common among all components so we attach them to Constructor.prototype
//
for (const k of ['w', 'h']) {
	Object.defineProperty(Constructor.prototype, k, {
		enumerable: true,
		configurable: true,
		get () {
			return this.data[k]
		},
		set(val) {
			this.data[k] = val
			return val
		},
	})
}


function State(name, component) {
	this[name] = true
	this.name = name
	this.component = component
	this.stack = []
}

State.prototype.set = function (name) {
	this[this.name] = undefined
	this[name] = true
	this.name = name
	this.isUpdated = true
}

State.prototype.save = function () {
	this.stack.push(this.name)
}

State.prototype.restore = function () {
	const name = this.stack.pop()
	if (name === undefined) {
		throw new ReferenceError('Tried to restore state with no states on the stack')
	}
	this.component.setState(name)
}

//Constructor.prototype.constructor = Constructor

export default Constructor
