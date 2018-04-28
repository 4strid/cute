import Cute from './lib/cute'

const Square = Cute.Constructor({
	render () {
		return (
			<rect w={this.w} h={this.h} x={0} y={0}>
				<fill color={this.props.color} />
			</rect>
		)
	},
	states: {
		Ready () {
			this.on('clickG', () => {
				console.log('I got clicked on!')
				console.log('my color is ' + this.props.color)
			})
		},
	},
})

export default Square
