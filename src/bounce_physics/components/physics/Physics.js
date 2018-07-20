import Cute from '../../../lib/cute'

const { MultiMap } = Cute.structures

import Body, { withBody } from './Body'
import Static, { withStatic } from './Static'
import Collider from './Collider'
import WorldBounds from './WorldBounds'

const Physics = Cute({
	render () {
		return (
			<PhysicsContext.Provider physics={this}>
				{this.props.children}
				<WorldBounds x={-1000} y={0} w={1000} h={this.h}/>
				<WorldBounds x={0} y={-1000} h={1000} w={this.w}/>
				<WorldBounds x={this.w} y={0} w={1000} h={this.h}/>
				<WorldBounds x={0} y={this.h} h={1000} w={this.w}/>
			</PhysicsContext.Provider>
		)
	},
	constructor: function Physics (props) {
		this.construct(props)
		// Constructor => component => body
		this.bodies = new MultiMap()
	},
	methods: {
		addBody (body, component) {
			this.bodies.set(component, body)
		},
		removeBody (body, component) {
			this.bodies.delete(component)
		},
		getBodies () {
			return this.bodies
		},
	},
	container: {
		children: [Body, Static, Collider],
		provide: physics => ({ physics }),
	},
})

export default Physics

export { Body, Static, Collider, WorldBounds, withBody, withStatic }
