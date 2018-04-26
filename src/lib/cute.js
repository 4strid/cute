import primitives from './primitives'
import Constructor from './constructor'
import { renderElement } from './util'

const Cute = {
	attach (RootComponent, canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')
		renderElement(this.ctx, RootComponent)
	},

	createElement (Type, props, ...children) {
		//console.log('it\'s JSX bro')

		// virtual tree .add new element
		// how to keep track of where we are in the tree? do we have to?
		// when do we add the children?
		// could shove this into the Screen, but better not: separation of
		// concerns
		
		//console.log(Type)
		//console.log(props)
		//console.log(children)

		if (props === null) {
			props = {}
		}

		props.children = children
		// if Type came from the Cute Constructor
		if (Constructor.prototype.isPrototypeOf(Type.prototype)) {
			return new Type(props)
		}
		if (Type instanceof Function) {
			return Type(props)
		}
		return primitives._lookup(Type)(props)
	},

	Constructor,
}

export default Cute
