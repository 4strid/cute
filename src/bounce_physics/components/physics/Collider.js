import Cute from '../../../lib/cute'

import storeSymbol from './symbol'

const Collider = Cute({
	render: () => <nothing/>,
	constructor: function Collider (props) {
		this.construct(props)
		this.bounce = this.props.bounce || 0
	},
	methods: {
		// TODO fixing an edge case cost me the ability for objects with dx/dy = 0 to
		// detect what diretion they were hit by. i'd like to restore that, but it's
		// time to put this branch to rest
		collide (collider, collidee) {
			// direction of collision (collidee.center - body.center)
			const cx =  (collidee.x + collidee.w / 2) - (collider.x + collider.w / 2)
			const cy =  (collidee.y + collidee.h / 2) - (collider.y + collider.h / 2)
			// sum of width and height
			const sw = collider.w + collidee.w
			const sh = collider.h + collidee.h
			// scaled collision direction
			//const scx = Math.abs(cx / sw * Math.abs(collider.dx - collidee.dx))
			//const scy = Math.abs(cy / sh * Math.abs(collider.dy - collidee.dy))
			const scx = Math.abs(cx / sw * Math.abs(collider.dx))
			const scy = Math.abs(cy / sh * Math.abs(collider.dy))
			//console.log('-----', collider.proxyOf.data.color, '-----')
			//console.log('c', cx, cy)
			//console.log('sc', scx, scy)
			// should we reflect off this axis? (cast boolean to number)
			const reflectx = (scx >= scy && Math.sign(cx) === Math.sign(collider.dx)) * 1
			const reflecty = (scy >= scx && Math.sign(cy) === Math.sign(collider.dy)) * 1
			//console.log('ref', reflectx, reflecty)
			//console.log('dd', collider.dx - collidee.dx, collider.dy - collidee.dy)
			// this is which side was hit
			const nx = (scx >= scy) * Math.sign(collider.dx - collidee.dx)
			const ny = (scy >= scx) * Math.sign(collider.dy - collidee.dy)
			//console.log('n', nx, ny)
			// penetration vector (sum of distances from center - actual distance * direction)
			const penx = (sw / 2 - Math.abs(cx)) * nx
			const peny = (sh / 2 - Math.abs(cy)) * ny
			//console.log('pen', penx, peny)

			return { collider, collidee, cx, cy, scx, scy, reflectx, reflecty, nx, ny, penx, peny }
		},
	},
	update () {
		const bodies = Cute.store[storeSymbol].getBodies()
		const colliders = bodies.getAll(this.props.collider)
		if (!colliders) {
			return
		}
		colliders.forEach((colliderBody, colliderComponent) => {
			const collisions = colliderComponent.getCollisions()
			for (const collision of collisions) {
				if (collision.component instanceof this.props.collidee) {
					const collideeComponent = collision.component
					const collideeBody = bodies.get(collideeComponent)
					const bodyCollision = this.collide(colliderBody, collideeBody)
					if (this.props.action) {
						this.props.action(colliderComponent, collideeComponent, bodyCollision)
					} else {
						colliderBody.x -= bodyCollision.penx
						colliderBody.y -= bodyCollision.peny

						// this is a little silly, could have been vx = reflectx ? vx * -1 : vx but I wanted to do all the math without any conditionals
						colliderBody.vx -= 2 * colliderBody.vx * bodyCollision.reflectx
						colliderBody.vx *= this.bounce
						colliderBody.vy -= 2 * colliderBody.vy * bodyCollision.reflecty
						colliderBody.vy *= this.bounce
					}
					if (this.props.reaction) {
						this.props.reaction(colliderComponent, collideeComponent, collision)
					}
				}
			}
		})
	},
})

export default Collider
