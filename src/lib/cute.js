import primitives from './primitives'
import Constructor from './constructor'
import Screen from './screen'
import Dispatch from './dispatch'
import Scheduler from './scheduler'
import NodeContext from './node'
import structures from './structures'

const Cute = (plan, ...wrappers) => {
	return Constructor(plan, ...wrappers)
}

Cute.structures = structures

Cute.attach = function (RootComponent, parentElement, canvasWidth, canvasHeight) {
	return new App(RootComponent, parentElement, canvasWidth, canvasHeight)
}

function App (RootComponent, domNode, w, h) {
	this.domNode = domNode
	this.canvas = document.createElement('canvas')
	this.ctx = this.canvas.getContext('2d')

	this.screen = new Screen(this.ctx)
	this.dispatch = new Dispatch(this.canvas, this.screen)
	this.scheduler = new Scheduler(this.screen)
	this.canvas.width = w
	this.canvas.height = h

	this.domNode.appendChild(this.canvas)

	this.Node = NodeContext(this.screen, this.dispatch, this.scheduler)

	this.screen.setDimensions(w, h)
	this.screen.setRootElement(RootComponent, this.Node)
	this.canvas.setAttribute('tabindex', '0')
}

Cute.createElement = function (type, props, ...children) {
	//console.log(type)
	//console.log(props)
	//console.log(children)
	if (typeof type === 'string') {
		return {
			type: primitives._lookup(type),
			props,
			children,
		}
	}
	return { type, props, children }
}

// Allows you to directly reference a child component from a parent
// component. Black magic sort of stuff. Generally you should avoid
// making refs if you can, but alas, sometimes you cannot
Cute.createRef = function () {
	return new Ref()
}

function Ref () { }

Ref.prototype.reference = function (component) {
	this.component = component
}

Cute.store = {}
Cute.createStore = function (name, value) {
	this.store[name] = value || {}
}

Cute.Constructor = Constructor

export default Cute

window.Cute = Cute
