import deepEqual from 'deep-equal'
import flatten from 'array-flatten'

import Constructor from './constructor'

// Nodes are the glue between components and Cute.
// By wrapping the Node constructor in a closure, we supply all the necessary
// components of Cute to each node
function NodeContext (screen, scheduler, dispatch) {
	function Node (type, props, children) {
		this.props = props || {}
		this.x = this.props.x || 0
		this.y = this.props.y || 0
		if (children.length) {
			this.props.children = flatten(children)
			//console.log('000000000')
			//console.log(this.props.children)
		}
		if (this.props.ref) {
			this.ref = this.props.ref
			// TODO refactor out deletes if it turns out to be a performance concern
		}
		if (this.props.key) {
			this.key = this.props.key
			delete this.props.key
		}
		this.type = type
	}

	function isInteractiveComponent (node) {
		return Constructor.prototype.isPrototypeOf(node.type.prototype)
	}

	// returns a rendered Node (or function if this node is a primitive)
	Node.prototype.render = function (props) {
		// this is a node that is an interactive Component that is being rerendered
		if (this.component) {
			this.component._receiveProps(props)
			return this.component.render()
		}
		// if this is an interactive Component
		if (isInteractiveComponent(this)) {
			this.component = new this.type(props, this)
			if (this.ref) {
				this.ref.reference(this.component)
			}
			return this.component.render()
		}
		return this.type(props)
	}

	Node.prototype.setParent = function (parent) {
		this.parent = parent

		if (isInteractiveComponent(this) && this.component) {
			this.x = this.component.x
			this.y = this.component.y
		}

		this.screenX = this.x + this.parent.screenX
		this.screenY = this.y + this.parent.screenY
	}

	Node.prototype.recursiveRender = function () {
		//console.log('rr')
		//console.log(this)
		this.rendered = this.render(this.props)
		// this is some kind of component
		if (this.rendered instanceof Node) {
			this.rendered.setParent(this)
			this.rendered.recursiveRender()
		// this is a primitive
		} else if (this.props.children) {
			this.children = this.props.children
			this.props.children.forEach(child => {
				//console.log(child)
				child.setParent(this)
				child.recursiveRender()
			})
		}
	}

	function compareProps (a, b) {
		for (const k in a) {
			// children are reconciled, if they are simple-equivalent they're the same
			// children's props were compared at a previous step
			if (k === 'children') {
				if (!('children' in b)) {
					return true
				}
				if (a.children.length !== b.children.length) {
					return true
				}
				for (let i = 0; i < a.children.length; i++) {
					if (a[i] !== b[i]) {
						return true
					}
				}
				continue
			}
			if (k === 'state') {
				// if state is updated, must rerender
				if (a.state.isUpdated) {
					return true
				}
				continue
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

	// sets own props to new props. returns whether or not an update was performed
	Node.prototype.receiveProps = function (props) {
		//console.log('receive props')
		//console.log(this)
		//console.log(props)
		this.x = props.x || 0
		this.y = props.y || 0
		const childMap = new MultiMap(this.props.children)

		let childrenUpdated = false

		if (props.children !== undefined) {
			//console.log('has children')
			props.children = props.children.map(newChild => {
				const oldChild = childMap.match(newChild)
				//return oldChild || newChild
				if (oldChild === undefined) {
					return newChild
				}
				console.log('new child props')
				console.log(newChild.props)
				childrenUpdated = oldChild.receiveProps(newChild.props) || childrenUpdated
				return oldChild
			})
		}

		const isUpdated = this.isUpdated || childrenUpdated || compareProps(this.props, props)

		if (!isUpdated) {
			return false
		}

		this.props = props

		return true
	}

	Node.prototype.rerender = function (isUpdated) {
		//console.log('rerender')
		//console.log(this)
		if (!isUpdated) {
			if (this.children) {
				this.children.forEach(child => {
					child.recursiveRerender()
				})
			}
			if (this.rendered instanceof Node) {
				this.rendered.setParent(this)
				this.rendered.recursiveRerender()
			}
		} else {
			const rerendered = this.render(this.props)

			if (!(rerendered instanceof Node)) {
				this.rendered = rerendered
				if (this.props.children) {
					this.children = this.props.children
					this.children.forEach(child => {
						child.setParent(this)
						if (child.rendered) {
							child.rerender(true)
						} else {
							child.recursiveRender()
						}
					})
				}
			} else if (this.rendered.type === rerendered.type) {
				this.rendered.setParent(this)
				const isUpdated = this.rendered.receiveProps(rerendered.props)
				this.rendered.rerender(isUpdated)
			} else {
				this.rendered = rerendered
				this.rendered.setParent(this)
				this.rendered.recursiveRender()
			}
		}

		this.isUpdated = false
		if (this.component) {
			this.component.state.isUpdated = false
		}
	}

	Node.prototype.recursiveRerender = function () {
		//console.log('recursive rerender')
		//console.log(this)
		if (this.isUpdated) {
			this.rerender(true)
			return
		}
		if (this.rendered instanceof Node) {
			this.rendered.recursiveRerender()
		}
		if (this.children) {
			this.children.forEach(child => {
				child.recursiveRerender()
			})
		}
	}

	Node.prototype.recursiveMove = function () {
		if (this.isMoved) {
			this.x = this.component.x
			this.y = this.component.y
		}
		if (this.rendered instanceof Node) {
			if (this.isMoved) {
				this.rendered.setParent(this)
			}
			this.rendered.recursiveMove()
		}
		if (this.children) {
			this.children.forEach(child => {
				if (this.isMoved) {
					child.setParent(this)
				}
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

	Node.prototype.destroy = function () {
		if (this.component) {
			dispatch.removeComponent(this.component)
		}
		scheduler.scheduleRender(this)
	}

	return Node
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
