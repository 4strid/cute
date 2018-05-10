import Cute from './lib/cute'

const Square = Cute.Constructor({
	render () {
		return (
			<rect w={this.w} h={this.h} x={0} y={0}>
				<fill color={this.props.color} />
			</rect>
		)
	},
	data () {
		return {
			color: this.props.color,
		}
	},
	methods: {
		randomColor () {
			return '#' + Math.floor(Math.random() * 16777215).toString(16)
		},
	},
	states: {
		Ready () {
			this.on('click', function (evt) {
				console.log('I got clicked! my color is ' + this.props.color)
			})
		},
	},
})

export default Square
