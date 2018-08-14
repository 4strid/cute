import Cute from '../../../lib/cute'

import storeSymbol from './symbol'

const Body = Cute({
	render () {
		return (
			<layer>
				{this.props.children}
			</layer>
		)
	},
	constructor: function Body (props) {
		this.construct(props)
		if (typeof this.proxyOf === 'undefined') {
			throw new TypeError('<Body> must proxy another component')
		}
		Cute.store[storeSymbol].addBody(this, this.proxyOf)
		this.vx = this.vx || 0
		this.vy = this.vy || 0
		this.dx = this.dx || 0
		this.dy = this.dy || 0
	},
	update (time) {
		this.dx = this.vx * time / 1000
		this.dy = this.vy * time / 1000

		this.x += this.dx
		this.y += this.dy
	},
	destroy () {
		Cute.store.physics.removeBody(this.proxyOf)
	},
	transform: false,
})

function withBody (render, wrapped) {
	return (
		<Body proxy={proxy => proxy(wrapped, 'x', 'y', 'vx', 'vy', 'dx', 'dy')}>
			{ render() }
		</Body>
	)
}

export default Body

export { withBody }
