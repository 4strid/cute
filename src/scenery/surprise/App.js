import Cute from '../../lib/cute'
import { ComponentMap } from '../../lib/components'
import Heart from './Heart'
import Cursor from './Cursor'

const App = Cute({
	render() {
		return (
			<layer>
				<fill-rect x={0} y={0} h={Cute.canvas.height} w={Cute.canvas.width} color={"#00368e"} />
				<fill-rect x={0} y={Cute.canvas.height / 2} h={50} w={50} color={"black"} />
				<ComponentMap ref={this.data.hearts}>
					<Heart handleDestroy={this.handleDestroy.bind(this)} state={this.state} />
				</ComponentMap>
				<Cursor state={this.state} w={8} h={8} />
			</layer>
		)
	},
	data() {
		return {
			hearts: Cute.createRef(),
		}
	},
	methods: {
		randomDimensions() {
			const MIN_ARC_SIZE = 10
			const MAX_ARC_SIZE = 50
			return Math.random() * (MAX_ARC_SIZE - MIN_ARC_SIZE) + MIN_ARC_SIZE
		},
		handleDestroy(evt) {
			this.data.hearts.destroy(evt.component)
		},
	},
	states: {
		Ready() {
			this.ChangeColors()
		},
		ChangeColors() {
			this.on('keydownG', evt => {
				if (evt.key === 'c') {
					return this.CreateHearts()
				}
				if (evt.key === 'd') {
					return this.DestroyHearts()
				}
			})
		},
		CreateHearts() {
			this.on('keydownG', evt => {
				if (evt.key === 'Escape') {
					return this.ChangeColors()
				}
				if (evt.key === 'd') {
					return this.DestroyHearts()
				}
			})
			this.on('clickG', evt => {
				const radiusLength = this.randomDimensions()
				console.log(Cute.canvas.height)
				this.data.hearts.create({
					h: radiusLength * 2,
					w: radiusLength * 2,
					x: evt.localX,
					y: evt.localY,
					r: radiusLength,
				})
			})
		},
		DestroyHearts() {
			this.on('keydownG', evt => {
				if (evt.key === 'Escape') {
					return this.ChangeColors()
				}
				if (evt.key === 'c') {
					return this.CreateHearts()
				}
			})
		},
	},
})

export default App