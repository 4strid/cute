import Constructor from './constructor'

// Nodes are the glue between components and Cute.
// By wrapping the Node constructor in a closure, we supply all the necessary
// components of Cute to each node
function NodeContext (screen, scheduler, dispatch) {
	function Node (Component, props, children) {
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

	Node.prototype.draw = function (ctx) {
		if (this.rendered instanceof Node) {
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
	Node.prototype.update = function () {
		// schedule a rerender
		scheduler.scheduleRender(this)
		// schedule a draw
		scheduler.scheduleDraw()
	}

	Node.prototype.addEventListener = function (component, evtype, handler) {
		console.log('1')
		console.log(this)
		dispatch.addEventListener(component, evtype, handler)
	}

	Node.prototype.clearEventListeners = function (component) {
		dispatch.clearEventListeners(component)
	}

	Node.prototype.addPersistentListener = function (component, evtype, handler) {
		dispatch.addPersistentListener(component, evtype, handler)
	}

	Node.prototype.removePersistentListener = function (component, evtype) {
		dispatch.removePersistentListener(component, evtype)
	}

	// haaaacky, but it will have to do for now
	screen.Node = Node

	return Node
}

export default NodeContext
