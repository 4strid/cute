import Cute from '../../../lib/cute'

const Collider = Cute({
	render: () => <nothing/>,
	constructor: function Collider (props) {
		this.construct(props)
		this.bounce = this.props.bounce || 0
	},
	methods: {
		collide (collider, collidee) {
			// direction of collision (collidee.center - body.center)
			const cx =  (collidee.x + collidee.w / 2) - (collider.x + collider.w / 2)
			const cy =  (collidee.y + collidee.h / 2) - (collider.y + collider.h / 2)
			// sum of width and height
			const sw = collider.w + collidee.w
			const sh = collider.h + collidee.h
			// scaled collision direction
			// ... idk about these deltas but we'll see if it works
			const scx = cx / sw * (collider.dx - collidee.dx)
			const scy = cy / sh * (collider.dy - collidee.dy)
			// should we reflect off this axis? (cast boolean to number)
			const reflectx = (scx >= scy) * 1
			const reflecty = (scy >= scx) * 1
			// this is which side was hit
			const nx = (Math.abs(scx) >= Math.abs(scy)) * Math.sign(scx)
			const ny = (Math.abs(scy) >= Math.abs(scx)) * Math.sign(scy)
			// penetration vector (sum of distances from center - actual distance * direction)
			const penx = (sw / 2 - Math.abs(cx)) * nx
			const peny = (sh / 2 - Math.abs(cy)) * ny

			return { collider, collidee, cx, cy, scx, scy, reflectx, reflecty, nx, ny, penx, peny }
		},
	},
	update () {
		const bodies = this.props.physics.getBodies()
		const colliderConstructor = this.props.collider.constructor
		const collideeConstructor = this.props.collidee.constructor 
		const colliders = bodies.getAll(colliderConstructor)
		colliders.forEach((_, collider) => {
			const colliderComponent = collider.proxyOf
			const collisions = colliderComponent.getCollisions()
			for (const collision of collisions) {
				if (collision.component.constructor === collideeConstructor) {
					const collideeComponent = collision.component
					const collidee = bodies.get(colliderComponent)
					const collision = this.collide(collider, collidee)
					if (this.action) {
						this.action(colliderComponent, collideeComponent, collision)
					} else {
						collider.x += collision.penx
						collider.y += collision.peny

						// this is a little silly, could have been vx = reflectx ? vx * -1 : vx but I wanted to do all the math without any conditionals
						collider.vx -= 2 * collider.vx * collision.reflectx
						collider.vx *= this.bounce
						collider.vy -= 2 * collider.vy * collision.reflecty
						collider.vy *= this.bounce
					}
					if (collider.reaction) {
						collider.reaction(colliderComponent, collideeComponent, collision)
					}
				}
			}
		})
	},
})
