import primitives from './primitives'
import Constructor from './constructor'
import Screen from './screen'
import Dispatch from './dispatch'
import { renderElement } from './util'

const Cute = {}

Cute.canvas = document.createElement('canvas')
Cute.ctx = Cute.canvas.getContext('2d')

Cute.screen = new Screen()
Cute.dispatch = new Dispatch(Cute.canvas, Cute.screen)

Cute.attach = function (RootComponent, parentElement, canvasWidth, canvasHeight) {
	this.canvas.width = canvasWidth
	this.canvas.height = canvasHeight
	parentElement.appendChild(this.canvas)
	this.canvas.setAttribute('tabindex', '0')
	this.canvas.focus()
	renderElement(this.ctx, RootComponent)
}

Cute.createElement = function (Type, props, ...children) {
	console.log('it\'s JSX bro')

	// virtual tree .add new element
	// how to keep track of where we are in the tree? do we have to?
	// when do we add the children?
	// could shove this into the Screen, but better not: separation of
	// concerns
	
	console.log(Type)
	//console.log(props)
	//console.log(children)

	if (props === null) {
		props = {}
	}

	props.children = children
	// if Type came from the Cute Constructor
	if (Constructor.prototype.isPrototypeOf(Type.prototype)) {
		const component = new Type(props)
		this.screen.add(component)
		return component
	}
	if (Type instanceof Function) {
		return Type(props)
	}
	return primitives._lookup(Type)(props)
}

Cute.Constructor = Constructor

export default Cute
