import primitives from './primitives'
import Constructor from './constructor'
import Screen from './screen'
import Dispatch from './dispatch'
import Scheduler from './scheduler'
import NodeContext from './node'

const Cute = plan => {
	return Constructor(plan)
}

Cute.canvas = document.createElement('canvas')
Cute.ctx = Cute.canvas.getContext('2d')

Cute.screen = new Screen(Cute.ctx)
Cute.dispatch = new Dispatch(Cute.canvas, Cute.screen)
Cute.scheduler = new Scheduler(Cute.screen)

const Node = NodeContext(Cute.screen, Cute.scheduler, Cute.dispatch)

Cute.attach = function (RootComponent, parentElement, canvasWidth, canvasHeight) {
	this.canvas.width = canvasWidth
	this.canvas.height = canvasHeight
	parentElement.appendChild(this.canvas)
	this.canvas.setAttribute('tabindex', '0')
	this.canvas.focus()
	this.screen.setDimensions(canvasWidth, canvasHeight)
	this.screen.setRootElement(RootComponent)
}

Cute.createElement = function (type, props, ...children) {
	//console.log(type)
	//console.log(props)
	//console.log(children)
	if (typeof type === 'string') {
		return new Node(primitives._lookup(type), props, children)
	}
	return new Node(type, props, children)
}

// Allows you to directly reference a child component from a parent
// component. Black magic sort of stuff. Generally you should avoid
// making refs if you can, but alas, sometimes you cannot
Cute.createRef = function () {
	return new Ref()
}

function Ref () {}

Ref.prototype.reference = function (component) {
	this.component = component
}

Cute.Constructor = Constructor

export default Cute
