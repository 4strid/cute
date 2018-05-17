import Cute from './lib/cute'

const Balloon = Cute.Constructor({
	render () {
		return (
			<rect w={this.w} h={this.h} x={0} y={0}>
				<fill color={this.props.color} />
			</rect>
		)
	},
	states: {
		Ready () {
			this.on('click', this.props.onClick)
			this.update = time => {
				this.y -= time * 0.01
			}
		},
	},
	w: 14,
	h: 14,
})

export default Balloon
