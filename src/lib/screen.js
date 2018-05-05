import rbush from 'rbush'
import Constructor from './constructor'

function Screen (ctx) {
	// the drawing context of the canvas
	this.ctx = ctx
	// map from component to screen element
	this.map = new Map()
	// r-tree for calculating intersections
	this.tree = rbush()

	// screen is the parent of the root node so it must have coordinates
	this.x = 0
	this.y = 0
}

Screen.Node = function (Component, props, children) {
	props = props || {}
	this.x = props.x || 0
	this.y = props.y || 0
	if (children.length) {
		props.children = children
	}
	if (Constructor.prototype.isPrototypeOf(Component.prototype)) {
		this.component = new Component(props, this)
	} else {
		this.render = Component
		this.props = props
	}
}

Screen.Node.prototype.draw = function (ctx) {
	if (this.rendered instanceof Screen.Node) {
		ctx.save()
		// ctx.scale
		// ctx.rotate
		ctx.translate(this.x, this.y)
		this.rendered.draw(ctx)
		ctx.restore()
	} else {
		// call primitive draw function
		this.rendered(ctx)
	}
}

Screen.Node.prototype.update = function () {
	// remove all children from collision tree
	// remove self from collision tree
	// remove self from parent
	// rerender self, adding to parent
}

Screen.prototype.setRootElement = function (node) {
	this.root = this.addNode(node, this)
	this.root.draw(this.ctx)
}

// node is the node to add, parent is its parent node
Screen.prototype.addNode = function (node, parent) {
	node.parent = parent
	if (!(node instanceof Screen.Node)) {
		// we have hit the bottom of the tree
		return node
	}
	// node is a Constructor component
	if (node.component) {
		node.rendered = this.addNode(node.component.render(), node)
		// interactive components are added to the r-tree
		this.addToRTree(node.component, parent)
	} else {
		// node is a primitive or functional component
		node.rendered = this.addNode(node.render(node.props), node)
	}
	if (node.rendered instanceof Function && node.props.children) {
		// node is a primitive with children
		node.children = new Map(
			node.props.children.map(child => [this.addNode(child, node), child])
		)
	}
	return node
}

Screen.prototype.addToRTree = function (el, parent) {
	const screenObj = new ScreenObject(el, parent)
	//this.map.set(el, screenObj)
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

Screen.prototype.queryPointAll = function (x, y) {
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

function ScreenObject (elem, parent) {
	let x = elem.x
	let y = elem.y
	while (parent) {
		x += parent.x
		y += parent.y
		// the screen has no parent so this loop ends when we hit the screen
		parent = parent.parent
	}
	this.elem = elem
	// assign minX, minY, maxX, maxY
	this.minX = x
	this.maxX = x + this.elem.w
	this.minY = y
	this.maxY = y + this.elem.h
}

export default Screen
