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
			this.node.removeEventListeners(this)
			this.state.set(state)
			plan.states[state].call(this)
			this.node.scheduleRender()
		}
	}
	if (plan.update) {
		//console.log('assigned update')
		prototype.update = plan.update
	}

	// even this doesn't appear to work in Chrome, the functions are still called ''
	//function nameFunction (name) {
	//	return {[name]: function (props, node) {return construct.call(this, props, node)}}[name]
	//}

	//const Component = nameFunction(plan.displayName || 'Component')

	//console.log(Component.name)
	//console.log(Component)

	function Component (props, node) {
		//console.log('initializing component')
		this.props = props
		this.node = node

		// set up data handlers
		const data = plan.data ? plan.data.call(this) : {}

		// set initial positional values
		Object.assign(data, {
			x: props.x || plan.x || 0,
			y: props.y || plan.y || 0,
			w: props.w || plan.w || 0,
			h: props.h || plan.h || 0,

			//***ML ADDED THIS***
			//---------------------------------
			r: props.r || plan.r || 0,
			sa: props.sa || plan.sa || 0,
			ea: props.ea || plan.ea || 0,
			ccw: props.ccw || plan.ccw || 0,
			//---------------------------------
		})
		this.data = {}
		for (const k in data) {
			Object.defineProperty(this.data, k, {
				enumerable: true,
				get () {
					return data[k]
				},
				set (val) {
					if (val !== data[k]) {
						console.log('blehhhh')
						console.log(k)
						data[k] = val
						node.scheduleRender()
					} else {
						//console.log('blehhhh')
						//console.log(k)
						//console.log(data[k])
						//console.log(val)
						data[k] = val
						node.scheduleRender()
					}
				},
			})
		}

		// allow for moving the component without rerendering it
		for (const k of ['x', 'y']) {
			Object.defineProperty(this, k, {
				enumerable: true,
				get () {
					return data[k]
				},
				set (val) {
					if (val !== data[k]) {
						data[k] = val
						node.scheduleMove()
					}
				},
			})
		}


		// TODO: handle async loading, then call start state when ready

		// this leads to inconsistent state between parent and child if the
		// parent immediately transitions to a new state. seek a better solution
		//
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

		// attempt to call the startState function
		if (this[startState] !== undefined) {
			this[startState]()
		} else if (this.Ready) {
			this.Ready()
		}
	}

	Component.prototype = prototype
	Component.prototype.constructor = Component

	if (plan.displayName) {
		Component.displayName = plan.displayName
	}

	return Component
}

Constructor.prototype = {
	// listen for a certain evtype. handler is removed upon state change
	on (evtype, handler) {
		this.node.addEventListener(this, evtype, handler)
	},
	// listen for a certain evtype. handler persists through state changes
	listen (evtype, handler) {
		this.node.addPersistentListener(this, evtype, handler)
	},
	// removes a persistent listener
	unlisten (evtype) {
		this.node.removePersistentListener(this, evtype)
	},
	getCollisions () {
		return this.node.getCollisions(this)
	},
	// sets own state to the given name and attempts to call that state function
	setState (name) {
		this.state.set(name)
		if (this[name]) {
			this[name]()
		}
	},
	_receiveProps (props) {



		//***ML ADJUSTED THIS***
		//---------------------------------
		for (const k of ['x', 'y', 'w', 'h', 'r', 'sa', 'ea', 'ccw']) {
			if (props[k] !== undefined && props[k] !== this.props[k]) {
				// call getters / setters to act appropriately
				this[k] = props[k]
			}
		}
		//---------------------------------




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


//***ML ADJUSTED THIS***
//---------------------------------
for (const k of ['w', 'h', 'r', 'sa', 'ea', 'ccw']) {
	Object.defineProperty(Constructor.prototype, k, {
		enumerable: true,
		get () {
			return this.data[k]
		},
		set (val) {
			this.data[k] = val
			return val
		},
	})
}
//---------------------------------


function State (name, component) {
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
	this.component[name]()
}

//Constructor.prototype.constructor = Constructor

export default Constructor