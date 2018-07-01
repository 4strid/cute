import Cute from '../lib/cute'

const Cursor = Cute({
	render () {
		let fillColor = '#000000'
		if (this.state.CreateSquares) {
			fillColor = '#44ff44'
		}
		if (this.state.DestroySquares) {
			fillColor = '#ff4444'
		}

		// makes a nice + shape
		return (
			<layer>
				<rect w={2} h={this.h} x={this.w / 2 - 1} y={0}>
					<fill color={fillColor} />
				</rect>
				<rect w={this.w} h={2} x={0} y={this.h / 2 - 1}>
					<fill color={fillColor} />
				</rect>
			</layer>
		)
	},
	states: {
		Ready () {
			this.on('mousemoveG', evt => {
				// canvasX and canvasY are the mouse coordinates with respect to the canvas,
				// handy for global mouse listeners
				this.x = evt.canvasX - this.w / 2
				this.y = evt.canvasY - this.h / 2
			})
		},
		// shouldn't have to define empty functions
		// but maybe you should indicate what states you expect to receive nonetheless
		//
		// note: you don't have to define empty functions any more!
		/*
		 *ChangeColors () {
		 *    // nothing to do
		 *},
		 *CreateSquares () {
		 *    // nothing to do
		 *},
		 *DestroySquares () {
		 *    // nothing to do
		 *    // maybe we shouldn't have to define these
		 *},
		 */
	},
})

export default Cursor
