import Cute from '../../../lib/cute'

const { MultiMap } = Cute.structures

import Body from './Body'
import Static from './Static'
import Collider from './Static'

const Physics = Cute({
	constructor: function Physics () {
		this.construct()
		this.bodies = new MultiMap()
		this.colliders = new MultiMap()
		this.context = Cute.createContext()
		this.context.addProvider(Physics, physics => ({ physics }))
		this.context.addConsumer(Body)
		this.context.addConsumer(Static)
		this.context.addConsumer(Collider)
	},
	methods: {
		updateCollisions (collider) {
			const colliderConstructor = collider.collider.constructor
			const collideeConstructor = collider.collidee.constructor 
			const bodies = this.bodies.getAll(colliderConstructor)
			bodies.forEach((_ ,body) => {
				// TODO somehow attach ref to child component
				const colliderComponent = body.proxy
				const collisions = colliderComponent.getCollisions()
				for (const collision of collisions) {
					if (collision.component.constructor === collideeConstructor) {
						const collideeComponent = collision.component
						if (collider.action) {
							collider.action(colliderComponent, collideeComponent, collision)
						} else {
							this.collide(body, collision)
						}
						if (collider.reaction) {
							collider.reaction(colliderComponent, collideeComponent, collision)
						}
					}
				}
			})
		},
		updateBody (body, time) {
			body.dx = body.vx * time / 1000
			body.dy = body.vy * time / 1000

			body.x += body.dx
			body.y += body.dy
		},
		collide (body, collision) {
			// direction of collision (collidee.center - body.center)
			const cx =  (collidee.x + collidee.w / 2) - (this.x + this.w / 2)
			const cy =  (collidee.y + collidee.h / 2) - (this.y + this.h / 2)
			// sum of width and height
			const sw = this.w + collidee.w
			const sh = this.h + collidee.h
			// scaled collision direction
			const scx = cx / sw * dx
			const scy = cy / sh * dy
			// should we reflect off this axis? (cast boolean to number)
			const reflectx = (scx >= scy) * 1
			const reflecty = (scy >= scx) * 1
			// this is which side was hit
			const nx = (Math.abs(scx) >= Math.abs(scy)) * Math.sign(scx)
			const ny = (Math.abs(scy) >= Math.abs(scx)) * Math.sign(scy)
			// penetration vector
			const penx = (sw / 2 - Math.abs(cx)) * nx
			const peny = (sh / 2 - Math.abs(cy)) * ny

			this.x += penx
			this.y += peny

			this.bounce(reflectx, reflecty)
		}
	},
})

export default Physics



