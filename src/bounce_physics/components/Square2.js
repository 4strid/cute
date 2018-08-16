import Cute from '../../lib/cute'

import { withBody } from './physics'

const Square = Cute({
	//displayName: 'Square',
	constructor: function Square (props) {
		this.construct(props)
		const velocity = randomVelocity()
		this.vx = velocity * randomDirection()
		this.vy = velocity * randomDirection()
	},
	render () {
		return (
			<rect w={this.w} h={this.h} x={0} y={0}>
				<fill color={this.data.color} />
			</rect>
		)
	},
	data () {
		return {
			color: randomColor(),
		}
	},
	methods: {
		switchColors () {
			this.data.color = randomColor()
		},
	},
	states: {
		Ready () {
			this.on('click', evt => {
				this.props.handleDestroy(evt)
			})
		},
	},
}, withBody)

// returns a random color
function randomColor () {
	const hex = Math.floor(Math.random() * 0x1000000).toString(16)
	return '#' + '0'.repeat(6 - hex.length) + hex
}

// returns a random speed in pixels per second
function randomVelocity () {
	const MIN_V = 27
	const MAX_V = 40
	return Math.random() * (MAX_V - MIN_V) + MIN_V
}

// returns 1 or -1
function randomDirection () {
	return Math.random() > 0.5 ? 1 : -1
}

export default Square
