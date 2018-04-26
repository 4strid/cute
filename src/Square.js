import Cute from './lib/cute'

const Square = Cute.Constructor({
	render () {
		return (
			<rect w={this.w} h={this.h} x={0} y={0}>
				<fill color={this.props.color} />
			</rect>
		)
		//return (
			//<fill-rect w={this.w} h={this.h} x={0} y={0} color={this.props.color}/>
		//)
	},
})

export default Square
