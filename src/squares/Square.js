import Cute from '../lib/cute'

const Square = Cute({
	render() {
		return (
			<path>
				<rect w={this.w} h={this.h} x={0} y={0}>
					<fill color={this.data.color} />
					<stroke color={"red"} />
				</rect>
			</path>
		)
	},
	data() {
		return {
			color: this.randomColor(),
		}
	},
	methods: {
		randomColor () {
			const hex = Math.floor(Math.random() * 16777215).toString(16)
			return '#' + '0'.repeat(6 - hex.length) + hex
		},
	},
	states: {
		ChangeColors() {
			this.on('click', () => {
				this.data.color = this.randomColor()
			})
		},
		CreateSquares() {
			// nothing to do
		},
		DestroySquares() {
			// this is the same pattern as in React: pass a handler down as a prop
			this.on('click', this.props.handleDestroy)
		},
	},
})

export default Square
