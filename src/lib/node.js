import deepEqual from 'deep-equal'
import flatten from 'array-flatten'

import Constructor from './constructor'

// Nodes are the glue between components and Cute.
// By wrapping the Node constructor in a closure, we supply all the necessary
// components of Cute to each node
function NodeContext (screen, dispatch, scheduler) {
	function Node (params) {
		if (params instanceof Node) {
			console.log('sho nuff!')
			return params
		}
		if (params instanceof Function) {
			return params
		}
		if (typeof params === 'string') {
			return new TextNode(params)
		}
		let { type, props, children } = params
		this.props = props || {}
		this.x = this.props.x || 0
		this.y = this.props.y || 0
		this.w = this.props.w
		this.h = this.props.h
		if (type.name) {
			this.displayName = type.name
		}
		if (children.length) {
			children = flatten(children)
			children = children.filter(child => child)
			if (children.length) {
				this.props.children = children.map(child => {
					return new Node(child)
				})
			}
			//console.log('000000000')
			//console.log(this.props.children)
		}
		if (this.props.ref) {
			this.ref = this.props.ref
		}
		if (this.props.key) {
			this.key = this.props.key
		}
		this.type = type
	}

	function isInteractiveComponent (node) {
		return Constructor.prototype.isPrototypeOf(node.type.prototype)
	}

	// returns a rendered Node (or function if this node is a primitive)
	Node.prototype.render = function (props) {
		// pass own dimensions as defaults
		if (!('w' in props)) {
			props.w = this.w
		}
		if (!('h' in props)) {
			props.h = this.h
		}
		// this is a node that is an interactive Component that is being rerendered
		if (this.component) {
			return this.component.render()
		}
		// if this is an interactive Component
		if (isInteractiveComponent(this)) {
			this.component = new this.type(props)
			this.component.node = this
			// initialize state without triggering a rerender
			this.component[this.component.state.name] &&
				this.component[this.component.state.name]()
			if (this.ref) {
				if (this.ref instanceof Function) {
					this.ref(this.component)
				} else {
					this.ref.reference(this.component)
				}
			}
			return this.component.render()
		}
		return this.type(props)
	}

	Node.prototype.recursiveRender = function () {
		//console.log('rr')
		//console.log(this)
		this.rendered = new Node(this.render(this.props))
		// this is some kind of component
		if (this.rendered instanceof Node) {
			this.rendered.setParent(this)
			this.rendered.recursiveRender()
		// this is a primitive
		} else if (this.props.children) {
			this.children = this.props.children
			this.children.forEach(child => {
				child.setParent(this)
				child.recursiveRender()
			})
		}
	}

	Node.prototype.setParent = function (parent) {
		this.parent = parent

		if (isInteractiveComponent(this) && this.component) {
			this.x = this.component.x
			this.y = this.component.y
		}

		if (this.type.transform === false) {
			this.x = 0
			this.y = 0
		}

		if (this.w === undefined) {
			this.w = this.parent.w
		}
		if (this.h === undefined) {
			this.h = this.parent.h
		}

		this.screenX = this.x + this.parent.screenX
		this.screenY = this.y + this.parent.screenY
	}

	function compareProps (a, b) {
		for (const k in a) {
			// children have been reconciled, if they are simple-equivalent they're the same
			// children's props were compared as part of reconciliation
			if (k === 'children') {
				if (!('children' in b)) {
					return true
				}
				if (a.children.length !== b.children.length) {
					return true
				}
				for (let i = 0; i < a.children.length; i++) {
					if (a.children[i] !== b.children[i]) {
						return true
					}
				}
				continue
			}
			if (k === 'state') {
				// if state is updated, must rerender
				if (b.state.isUpdated) {
					return true
				}
				continue
			}
			// feels like there must be a better way to do this
			if (a[k] instanceof Function && b[k] instanceof Function) {
				if (a[k] === b[k]) {
					continue
				}
				if (a[k].toString() === b[k].toString()) {
					continue
				}
			}
			if (!deepEqual(a[k], b[k])) {
				return true
			}
		}
		// plausible that we don't need this check
		for (const k in b) {
			if (!(k in a)) {
				return true
			}
		}
		return false
	}

	// sets own props to new props. sets own isUpdated property if props or children are updated
	Node.prototype.receiveProps = function (props) {
		//console.log('receive props')
		//console.log(this.component || this.displayName)
		//console.log(props)
		
		const childMap = new MultiMap(this.children)

		if (this.children !== undefined && props.children !== undefined) {
			//console.log('has children')
			props.children = props.children.map(newChild => {
				const oldChild = childMap.match(newChild)
				//return oldChild || newChild
				if (oldChild === undefined) {
					return newChild
				}
				//console.log('new child props')
				//console.log(newChild.props)
				oldChild.receiveProps(newChild.props)
				//childrenUpdated = childrenUpdated || oldChild.isUpdated || oldChild.propsUpdated
				return oldChild
			})

		}

		// destroy any nodes left over
		childMap.forEach(node => {
			node.destroy()
		})

		//this.children = props.children

		this.propsUpdated = compareProps(this.props, props)
		this.props = props
		if (this.propsUpdated && this.component) {
			this.component._receiveProps(this.props)
		}
	}

	Node.prototype.rerender = function () {
		//console.log('rerender')
		//console.log(this.component || this.displayName)
		//if (screen.renderMap.has(this)) {
		//console.log('rerendered more than once')
		//console.log(this)
		//} else {
		//screen.renderMap.set(this, this)
		//}

		if (!this.isUpdated && !this.propsUpdated) {
			//console.log('xxxxxxx')
			//console.log(this)
			if (this.rendered instanceof Node) {
				this.rendered.setParent(this)
				this.rendered.rerender()
			}
			if (this.children) {
				this.children.forEach(child => {
					child.setParent(this)
					child.rerender()
				})
			}
		} else {
			//console.log('yyyyyyy')
			//console.log(this)
			const rerendered = new Node(this.render(this.props))

			if (!(rerendered instanceof Node)) {
				this.rendered = rerendered
				this.children = this.props.children
				if (this.children) {
					this.children.forEach(child => {
						child.setParent(this)
						if (child.rendered) {
							child.rerender()
						} else {
							child.recursiveRender()
						}
					})
				}
			} else if (this.rendered.type === rerendered.type) {
				this.rendered.setParent(this)
				this.rendered.receiveProps(rerendered.props)
				this.rendered.rerender()
			} else {
				this.rendered = rerendered
				this.rendered.setParent(this)
				this.rendered.recursiveRender()
			}
		}

		// reset flags
		this.isUpdated = false
		this.propsUpdated = false
		if (this.component) {
			this.component.state.isUpdated = false
		}
	}

	Node.prototype.recursiveUpdate = function (time) {
		if (this.rendered instanceof Node) {
			//console.log('updatinggggg')
			//console.log(this.component)
			//console.log(this.component.update)
			if (this.component && this.component.update) {
				this.component.update(time)
			}
			this.rendered.recursiveUpdate(time)
		} else {
			if (this.children) {
				this.children.forEach(child => {
					child.recursiveUpdate(time)
				})
			}
		}
	}


	Node.prototype.recursiveMove = function () {
		if (this.isMoved) {
			this.x = this.component.x
			this.y = this.component.y
		}
		if (this.rendered instanceof Node) {
			this.rendered.setParent(this)
			this.rendered.recursiveMove()
		}
		if (this.children) {
			this.children.forEach(child => {
				child.setParent(this)
				child.recursiveMove()
			})
		}
		this.isMoved = false
	}

	Node.prototype.draw = function (ctx) {
		ctx.save()
		// ctx.scale
		// ctx.rotate
		ctx.translate(this.x, this.y)
		if (this.rendered instanceof Node) {
			this.rendered.draw(ctx)
		} else {
			// call primitive draw function
			this.rendered(ctx)
		}
		ctx.restore()
	}

	Node.prototype.scheduleUpdate = function () {
		scheduler.scheduleUpdate(this)
	}

	// this can only ever be called from interactive component nodes
	Node.prototype.scheduleRender = function () {
		// schedule a rerender
		this.isUpdated = true
		scheduler.scheduleRender(this)
	}

	Node.prototype.scheduleMove = function () {
		this.isMoved = true
		scheduler.scheduleMove(this)
	}

	Node.prototype.addEventListener = function (component, evtype, handler) {
		dispatch.addEventListener(component, evtype, handler)
	}

	Node.prototype.removeEventListeners = function (component) {
		dispatch.removeEventListeners(component)
	}

	Node.prototype.addPersistentListener = function (component, evtype, handler) {
		dispatch.addPersistentListener(component, evtype, handler)
	}

	Node.prototype.removePersistentListener = function (component, evtype) {
		dispatch.removePersistentListener(component, evtype)
	}

	Node.prototype.getCollisions = function (component) {
		return screen.getIntersections(component)
	},

	Node.prototype.destroy = function () {
		if (this.rendered instanceof Node) {
			this.rendered.destroy()
		}
		if (this.children) {
			this.children.forEach(child => {
				child.destroy()
			})
		}
		if (this.component) {
			dispatch.removeComponent(this.component)
			if (this.component.destroy) {
				this.component.destroy.call(this.component)
			}
		}
		// scheduler.scheduleRender(this)
		// I mean that can't be right, we're trying to disappear, why would we need to rerender?
	}

	return Node
}

// idk what else we need to make text rendering work
function TextNode (text) {
	this.text = text
}

// returns the component's key if it exists, otherwise the type
function getKey (node) {
	return node.key || node.type
}

// A Map that allows multiple insertions to the same key. Powers the children diffing algorithm.
function MultiMap (children) {
	this.map = new Map()
	this.indexMap = new Map()

	if (children) {
		for (const node of children) {
			const key = getKey(node)
			if (this.map.has(key)) {
				this.map.get(key).push(node)
			} else {
				this.map.set(key, [node])
				this.indexMap.set(key, 0)
			}
		}
	}
}

// attempt to find a matching node and if found, "remove" it from the multi-map (by incrementing index)
MultiMap.prototype.match = function (node) {
	const key = getKey(node)
	const array = this.map.get(key)
	if (array === undefined) {
		return undefined
	}
	const index = this.indexMap.get(key)
	this.indexMap.set(key, index + 1)
	return array[index]
}

// loop over remaining nodes after a series of pops
MultiMap.prototype.forEach = function (fn) {
	this.map.forEach((array, key) => {
		for (let i = this.indexMap.get(key); i < array.length; i++) {
			fn(array[i])
		}
	})
}


export default NodeContext
