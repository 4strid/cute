import Cute from '../../../lib/cute'

const Body = Cute({
	render () {
		return (
			<layer>{this.props.children}</layer>
		)
	},
	constructor: function Body (props) {
		this.construct(props)
		if (typeof this.proxyOf === 'undefined') {
			throw new TypeError('<Body> must proxy another component')
		}
		this.props.physics.addBody(this, this.proxyOf)
	},
	update (time) {
		this.dx = this.vx * time / 1000
		this.dy = this.vy * time / 1000

		this.x += this.dx
		this.y += this.dy
	},
})

export default Body
