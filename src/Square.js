import Cute from './lib/cute'

const Square = Cute({
	render () {
		return (
			<rect w={this.w} h={this.h} x={0} y={0}>
				<fill color={this.data.color} />
			</rect>
		)
	},
	data () {
		return {
			color: this.randomColor(),
		}
	},
	methods: {
		randomColor () {
			return '#' + Math.floor(Math.random() * 16777215).toString(16)
		},
	},
	states: {
		ChangeColors () {
			this.on('click', () => {
				this.data.color = this.randomColor()
			})
		},
		CreateSquares () {
			// nothing to do
		},
		DestroySquares () {
			// this is the same pattern as in React: pass a handler down as a prop
			this.on('click', this.props.handleDestroy)
		},
	},
})

export default Square
