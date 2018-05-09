import rbush from 'rbush'

function Screen (ctx) {
	// the drawing context of the canvas
	this.ctx = ctx
	// map from component to screen element
	this.map = new Map()
	// r-tree for calculating intersections
	this.tree = rbush()

	// screen is the parent of the root node so it must have coordinates
	this.screenX = 0
	this.screenY = 0

	// maybe try to find a more elegant solution than adding this at runtime
	this.Node = null
}

Screen.prototype.setRootElement = function (node) {
	this.root = this.addNode(node, this)
	this.draw()
}

Screen.prototype.rebuildRTree = function () {
	// begin construction of a new component -> screen object map
	this.newMap = new Map()
	// empty the r tree
	this.tree.clear()
	// reset z index
	this.zIndex = 0

	// recursively add all nodes to the r tree
	this.addToRTree(this.root)

	// only components which were not added to the new map will be garbage collected
	this.map = this.newMap
}

// node is the node to add, parent is its parent node
// it's kind of weird that this is in Screen.prototype, but it's actually
// quite a bit less convoluted to do it externally than as a Node method
Screen.prototype.addNode = function (node, parent) {
	if (!(node instanceof this.Node)) {
		// we have hit the bottom of the tree
		return node
	}
	node.parent = parent
	node.screenX = node.x + parent.screenX
	node.screenY = node.y + parent.screenY
	// node is a Constructor component
	if (node.component) {
		node.rendered = this.addNode(node.component.render(), node)
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

Screen.prototype.addToRTree = function (node) {
	if (node.component) {
		let screenObj = this.map.get(node.component)
		if (screenObj) {
			screenObj.update(node.screenX, node.screenY, this.zIndex++)
		} else {
			screenObj = new ScreenObject(node.component, node.screenX, node.screenY, this.zIndex++)
		}
		// addToRTree is called as part of rebuilding the r-tree so it operates on the new map rather than the map
		this.newMap.set(node.component, screenObj)
		// the tree has been cleared so we add the screen object to the fresh tree
		this.tree.insert(screenObj)
	}
	// recursively add all descendents of the node
	if (node.rendered instanceof this.Node) {
		this.addToRTree(node.rendered)
	}
	if (node.children) {
		node.children.forEach(this.addToRTree, this)
	}
}

Screen.prototype.draw = function () {
	this.rebuildRTree()
	this.root.draw(this.ctx)
}

// this may be part of scheduler updates
Screen.prototype.getIntersections = function (el) {
	const screenObj = this.map.get(el)
	return this.tree.search(screenObj)
}

// returns only the top most intersecting component
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

	return top.component
}

Screen.prototype.queryPointAll = function (x, y) {
	return this.tree.search({
		minX: x,
		maxX: x,
		minY: y,
		maxY: y,
	}).map(screenObj => screenObj.component)
}

// returns all intersections
Screen.prototype.query = function (q) {
	return this.tree.search({
		minX: q.x,
		maxX: q.x + q.w,
		minY: q.y,
		maxY: q.y + q.h,
	}).map(screenObj => screenObj.component)
}

function ScreenObject (component, x, y, z) {
	// set component
	this.component = component
	// assign minX, maxX, minY, maxY, and z
	this.update(x, y, z)
}

ScreenObject.prototype.update = function (x, y, z) {
	this.minX = x
	this.maxX = x + this.component.w
	this.minY = y
	this.maxY = y + this.component.h
	this.z = z
}

export default Screen
