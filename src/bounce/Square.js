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
		return {
			color: randomColor(),
		}
	},
	methods: {
		switchColors () {
			this.data.color = randomColor()
		},
		bounce (axis) {
			if (axis === 'x') {
				this.vx = this.vx * -1
			}
			if (axis === 'y') {
				this.vy = this.vy * -1
			}
			this.switchColors()
		},
	},
	states: {
		Ready () {
			const velocity = randomVelocity()
			this.vx = velocity * randomDirection()
			this.vy = velocity * randomDirection()
			this.on('click', evt => {
				this.props.handleDestroy(evt)
			})
		},
	},
	update (time) {
		const collisions = this.getCollisions()
		for (const collidee of collisions) {
			if (collidee.component.constructor === Square) {
				if (right(this) >= left(collidee) && right(this) - this.dx < left(collidee) - collidee.dx) {
					// collidee was to the right this frame but not last frame
					// prevent self from actually moving into the space occupied by the square
					//this.x = left(collidee) - this.w
					// change 
					this.bounce('x')
				}
				if (left(this) <= right(collidee) && left(this) - this.dx > right(collidee) - collidee.dx) {
					// left
					//this.x = right(collidee)
					this.bounce('x')
				}
				if (top(this) <= bottom(collidee) && top(this) - this.dy > bottom(collidee) - collidee.dy) {
					// above
					//this.y = bottom(collidee)
					this.bounce('y')
				}
				if (bottom(this) >= top(collidee) && bottom(this) - this.dy < top(collidee) - collidee.dy) {
					// below
					//this.y = top(collidee) - this.h
					this.bounce('y')
				}
			}
		}
		// "collide" with edges of screen
		if (left(this) <= 0) {
			this.x = 0
			this.bounce('x')
		}
		if (right(this) >= CANVAS_WIDTH) {
			this.x = CANVAS_WIDTH - this.w
			this.bounce('x')
		}
		if (top(this) < 0) {
			this.y = 0
			this.bounce('y')
		}
		if (bottom(this) >= CANVAS_HEIGHT) {
			this.y = CANVAS_HEIGHT - this.h
			this.bounce('y')
		}
		// the above could have been written more concisely, with a bunch of &&s but I think
		// this is easier to understand, so that's why it's so verbose

		// time is in ms and velocity is in pixels/s so divide by 1000
		// need to hold on to this for collision direction
		this.dx = this.vx * time / 1000
		this.dy = this.vy * time / 1000
		// move
		this.x += this.dx
		this.y += this.dy

		// you may be thinking to yourself, "if we move the first square, isn't the second square
		// no longer colliding with the first one?" however, the collision tree is not updated
		// until the next redraw so until that point, they're still "colliding"

		// TODO what if one of the components is destroyed? is that ok? look into this
	},
})

// returns a random color
function randomColor () {
	const hex = Math.floor(Math.random() * 16777215).toString(16)
	let color = hex
	while (color.length < 6) {
		color = '0' + color
	}
	return '#' + color
}

// returns a random speed in pixels per second
function randomVelocity () {
	const MIN_V = 25
	const MAX_V = 45
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
