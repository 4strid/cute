import rbush from 'rbush'
import Constructor from './constructor'

function Screen () {
	// map from component to screen element
	this.map = new Map()
	// r-tree for calculating intersections
	this.tree = rbush()

	// screen is the parent of the root node so it must have coordinates
	this.x = 0
	this.y = 0
}

Screen.Node = function (Component, props, children) {
	this.x = props.x || 0
	this.y = props.y || 0
	props = props || {}
	if (children.length) {
		props.children = children
	}
	if (Constructor.prototype.isPrototypeOf(Component.prototype)) {
		this.component = Component(props, this)
	} else {
		this.render = Component
		this.props = props
	}
}

Screen.prototype.setRootElement = function (node) {
	this.root = this.addNode(node, this)
}

// node is the node to add, parent is its parent node
Screen.prototype.addNode = function (node, parent) {
	let rendered
	// node is a Constructor component
	if (node.component) {
		rendered = node.component.render()
		// stateful components are added to the r-tree
		this.addToRTree(node.component, parent)
	} else {
		// node is a primitive or functional component
		rendered = node.render(node.props)
	}
	if (rendered instanceof Screen.Node) {
		// node is a component, primitives do not return a Node
		node.children = rendered.children.map(child => this.addNode(child, node))
	}
	if (node.render.children) {
		// node is a primitive with children
		node.children = node.render.children.map(child => this.addNode(child, node))
	}
	return node
}

Screen.prototype.add = function (el, parent) {
	const screenObj = new ScreenObject(el, parent)
	screenObj.z = this.zIndex++
	this.map.set(el, screenObj)
	this.tree.insert(screenObj)
}

Screen.prototype.remove = function (el) {
	const screenObj = this.map.get(el)
	if (!screenObj) {
		console.log('did not remove')
		return
	}
	this.map.delete(el)
	this.tree.remove(screenObj)
}

Screen.prototype.update = function (el) {
	const screenObj = this.map.get(el)
	if (!screenObj) {
		return
	}
	this.tree.remove(screenObj)
	screenObj.update()
	this.tree.insert(screenObj)
}

Screen.prototype.getIntersections = function (el) {
	const screenObj = this.map.get(el)
	return this.tree.search(screenObj)
}

// returns only the top most intersecting element
Screen.prototype.queryPoint = function (x, y) {
	const collisions = this.tree.search({
		minX: x,
		maxX: x,
		minY: y,
		maxY: y,
	})

	if (collisions.length === 0) {
		return null
	}

	const top = collisions.reduce((accum, current) => {
		if (current.z > accum.z) {
			return current
		}
		return accum
	})

	return top.elem
}

Screen.prototype.queryPointMulti = function (x, y) {
	return this.tree.search({
		minX: x,
		maxX: x,
		minY: y,
		maxY: y,
	}).map(screenObj => screenObj.elem)
}

// returns all intersections
Screen.prototype.query = function (q) {
	return this.tree.search({
		minX: q.x,
		maxX: q.x + q.w,
		minY: q.y,
		maxY: q.y + q.h,
	}).map(screenObj => screenObj.elem)
}

function ScreenObject (elem) {
	this.elem = elem
	// assign minX, minY, maxX, maxY
	this.update()
}

// this may become moot if the screen is just rebuilt upon rerendering
ScreenObject.prototype.update = function () {
	// how do we determine where an element is on the screen?
	// I think it might be time for that virtual dom already
	//this.minX = this.elem.screen.x
	//this.maxX = this.elem.screen.x + this.elem.w
	//this.minY = this.elem.screen.y
	//this.maxY = this.elem.screen.y + this.elem.h
	

	// this will work just to test the dispatch!
	this.minX = this.elem.x
	this.maxX = this.elem.x + this.elem.w
	this.minY = this.elem.y
	this.maxY = this.elem.y + this.elem.h
}

export default Screen
