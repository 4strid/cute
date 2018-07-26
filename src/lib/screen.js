import rbush from 'rbush'

// Holds the tree that contains all components
//
// used for drawing and collision detection
//
// screen.root is the root element of the application
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
}

Screen.prototype.setRootElement = function (node) {
	this.root = node
	this.root.setParent(this)
	this.root.recursiveRender()
	this.draw()
}

Screen.prototype.setDimensions = function (width, height) {
	this.w = width
	this.h = height
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
	// a node's rendered result is either a Node or a Function. If it's not a function,
	// it's a Node
	//
	// ... kind of hacky, but it lets us avoid the circular import of Node -> Screen -> Node
	if (!(node.rendered instanceof Function)) {
		this.addToRTree(node.rendered)
	}
	if (node.children) {
		//node.children.forEach(this.addToRTree, this)
		node.children.forEach(child => {
			this.addToRTree(child)
		})
	}
}

Screen.prototype.draw = function () {
	this.rebuildRTree()
	// TODO
	// obviously this clear screen should be more sophisticated
	this.ctx.fillStyle = '#ffffff'
	this.ctx.fillRect(0, 0, 1000, 1000)
	this.root.draw(this.ctx)
}

// this may be part of scheduler updates
Screen.prototype.getIntersections = function (el) {
	const screenObj = this.map.get(el)
	return this.tree.search(screenObj).reduce((collisions, screenObj) => {
		const collision = {
			x: screenObj.minX,
			y: screenObj.minY,
			w: screenObj.maxX - screenObj.minX,
			h: screenObj.maxY - screenObj.minY,
			top: screenObj.minY,
			right: screenObj.maxX,
			bottom: screenObj.maxY,
			left: screenObj.minX,
			component: screenObj.component,
		}
		if (screenObj.component !== el) {
			collisions.push(collision)
		}
		return collisions
	}, [])
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

// returns all elements at a given query point in descending Z order
Screen.prototype.queryPointAll = function (x, y) {
	return this.tree.search({
		minX: x,
		maxX: x,
		minY: y,
		maxY: y,
	}).sort((a, b) => {
		return b.z - a.z
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
	this.dx = x - this.minX
	this.dy = y - this.minY
	this.minX = x
	this.maxX = x + this.component.w
	this.minY = y
	this.maxY = y + this.component.h
	this.z = z
}

export default Screen
