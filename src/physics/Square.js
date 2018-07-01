import Cute from '../lib/cute'

import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'

const Square = Cute({
	displayName: 'Square',
	render () {
		return (
			<rect w={this.w} h={this.h} x={0} y={0}>
				<fill color={this.data.color} />
			</rect>
		)
	},
	data () {
		// we want it to move in a straight diagonal so |vx| must equal |vy|
		const velocity = randomVelocity()
		return {
			color: randomColor(),
			vx: velocity * randomDirection(),
			vy: velocity * randomDirection(),
		}
	},
	methods: {
		switchColors () {
			this.data.color = randomColor()
		},
		bounce (axis) {
			if (axis === 'x') {
				this.data.vx = this.data.vx * -1
				// nudge it a bit to make sure it's not still touching it next frame
				this.x += this.data.vx / 10
			}
			if (axis === 'y') {
				this.data.vy = this.data.vy * -1
				this.y += this.data.vy / 10
			}
			this.switchColors()
		},
	},
	states: {
		Ready () {
			this.on('click', evt => {
				console.log('sup son')
				this.props.handleDestroy(evt)
			})
		},
	},
	update (time) {
		const collisions = this.getCollisions()
		for (const collidee of collisions) {
			if (collidee.constructor === Square) {
				if (right(this) >= left(collidee)) {
					// collidee was to the right
					this.bounce('x')
				} else if (left(this) <= right(collidee)) {
					// left
					this.bounce('x')
				} else if (top(this) <= bottom(collidee)) {
					// above
					this.bounce('y')
				} else if (bottom(this) >= top(collidee)) {
					// below
					this.bounce('y')
				}
			}
		}
		// "collide" with edges of screen
		if (left(this) <= 0) {
			this.bounce('x')
		}
		if (right(this) >= CANVAS_WIDTH) {
			this.bounce('x')
		}
		if (top(this) <= 0) {
			this.bounce('y')
		}
		if (bottom(this) >= CANVAS_HEIGHT) {
			this.bounce('y')
		}
		// the above could have been written more concisely, with a bunch of &&s but I think
		// this is easier to understand, so that's why it's so verbose

		// time is in ms and velocity is in pixels/s so divide by 1000
		this.x += this.data.vx * time / 1000
		this.y += this.data.vy * time / 1000

		// you may be thinking to yourself, "if we move the first square, isn't the second square
		// no longer colliding with the first one?" however, the collision tree is not updated
		// until the next redraw so until that point, they're still "colliding"

		// TODO what if one of the components is destroyed? is that ok? look into this
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

// these are used to determine collision direction
function left (body) {
	return body.x
}

function right (body) {
	return body.x + body.h
}

function top (body) {
	return body.y
}

function bottom (body) {
	return body.y + body.h
}

export default Square
