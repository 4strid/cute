import Cute from '../../../lib/cute'

const Static = Cute({
	render () {
		return (
			<layer>{this.props.children}</layer>
		)
	},
	constructor: function Static (props) {
		this.construct(props)
		if (typeof this.proxyOf === 'undefined') {
			throw new TypeError('<Static> must proxy another component')
		}
		this.props.physics.addBody(this, this.proxyOf)
		this.vx = this.vx || 0
		this.vy = this.vy || 0
		this.dx = this.dx || 0
		this.dy = this.dy || 0
	},
	destroy () {
		this.props.physics.removeBody(this.proxyOf)
	},
})

function withStatic (render, wrapped) {
	return (
		<Static proxy={ proxy => proxy(wrapped, 'x', 'y', 'vx', 'vy', 'dx', 'dy') }>
			{ render() }
		</Static>
	)
}

export default Static

export { withStatic }
