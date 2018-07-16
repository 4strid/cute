import Cute from '../../../lib/cute'

const { MultiMap } = Cute.structures

const Physics = Cute({
	render () {
		return (
			<layer>{this.props.children}</layer>
		)
	},
	constructor: function Physics (props) {
		this.construct(props)
		// Constructor => component => body
		this.bodies = new MultiMap()
	},
	methods: {
		addBody (body, component) {
			this.bodies.add(component, body)
		},
		getBodies () {
			return this.bodies
		},
	},
})

export default Physics
