import rbush from 'rbush'
import SortedArray from 'sorted-array'

function Screen () {
	// map from component to screen element
	this.map = new Map()
	// r-tree for calculating intersections
	this.tree = rbush()
	// each ScreenObject determines its z index through insertion order
	// it gets its value from here
	this.zIndex = 0
}

Screen.prototype.add = function (el) {
	const screenObj = new ScreenObject(el)
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
