import Cute from '../../lib/cute'

import { Body } from './physics'

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
			<Body proxy={proxy => proxy(this, 'x', 'y', 'vx', 'vy')}>
				<rect w={this.w} h={this.h} x={0} y={0}>
					<fill color={this.data.color} />
				</rect>
			</Body>
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
})

// returns a random color
function randomColor () {
	return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

// returns a random speed in pixels per second
function randomVelocity () {
	const MIN_V = 20
	const MAX_V = 40
	return Math.random() * (MAX_V - MIN_V) + MIN_V
}

// returns 1 or -1
function randomDirection () {
	return Math.random() > 0.5 ? 1 : -1
}

export default Square
