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

// this can only ever be called from interactive component nodes
Screen.Node.prototype.report = function () {
	// rerender self
	// redraw the screen
	// RATHER
	// schedule an update
	this.shouldRerender = true

	// schedule a draw
	//scheduler.scheduleDraw()
}

// this is what will be called once per frame by the scheduler
Screen.Node.prototype.update = function (time) {

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
Screen.prototype.addNode = function (node, parent) {
	node.parent = parent
	if (!(node instanceof Screen.Node)) {
		// we have hit the bottom of the tree
		return node
	}
	// node is a Constructor component
	if (node.component) {
		node.rendered = this.addNode(node.component.render(), node)
		// THIS HAPPENS AT DRAW TIME NOW
		// interactive components are added to the r-tree
		// this.addToRTree(node.component, parent)
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
	//const screenObj = new ScreenObject(el, parent, this.zIndex++)
	//this.map.set(el, screenObj)
	//this.tree.insert(screenObj)
	if (node.component) {
		let screenObj = this.map.get(node.component)
		if (screenObj) {
			screenObj.update(node.parent, this.zIndex++)
		} else {
			screenObj = new ScreenObject(node.component, node.parent, this.zIndex++)
		}
		// addToRTree is called as part of rebuilding the r-tree so it operates on the new map rather than the map
		this.newMap.set(node.component, screenObj)
		// the tree has been cleared so we add the screen object to the fresh tree
		this.tree.insert(screenObj)
	}
	// recursively add all descendents of the node
	if (node.rendered instanceof Screen.Node) {
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

// old nodes are removed when the r-tree is regenerated now
//
//Screen.prototype.remove = function (el) {
	//const screenObj = this.map.get(el)
	//if (!screenObj) {
		//console.log('did not remove')
		//return
	//}
	//this.map.delete(el)
	//this.tree.remove(screenObj)
//}

// nodes are updated when the r-tree is regenerated now
//
//Screen.prototype.update = function (el) {
	//const screenObj = this.map.get(el)
	//if (!screenObj) {
		//return
	//}
	//this.tree.remove(screenObj)
	//screenObj.update()
	//this.tree.insert(screenObj)
//}

// this may be part of scheduler updates
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

function ScreenObject (elem, parent, z) {
	// set component
	this.elem = elem
	// assign minX, maxX, minY, maxY, and z
	this.update(parent, z)
}

ScreenObject.prototype.update = function (parent, z) {
	let x = this.elem.x
	let y = this.elem.y
	while (parent) {
		x += parent.x
		y += parent.y
		parent = parent.parent
	}
	this.minX = x
	this.maxX = x + this.elem.w
	this.minY = y
	this.maxY = y + this.elem.h
	this.z = z
}

export default Screen
