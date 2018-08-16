import Cute from '../../lib/cute'
import { ComponentMap } from '../../lib/components'
import Heart from './Heart'
import Character from './Character'
// import OtherCharacter from './OtherCharacter'
import Cursor from './Cursor'

const App = Cute({
	render() {
		return (
			<layer>
				{/* Start point */}
				<path>
					<arc x={Cute.canvas.width / 2} y={Cute.canvas.height / 2} r={5} sa={0} ea={2 * Math.PI} />
					<fill color="purple" />
				</path>
				{/* End Point */}
				<path>
					<arc x={(Cute.canvas.width / 2) + 100} y={(Cute.canvas.height / 2) + 100} r={5} sa={0} ea={2 * Math.PI} />
					<fill color="purple" />
				</path>
				<Character xPos={Cute.canvas.width / 2} yPos={Cute.canvas.height / 2} />
				{/* <OtherCharacter xPos={Cute.canvas.width / 2} yPos={Cute.canvas.height / 2} /> */}
				<ComponentMap ref={this.data.hearts}>
					<Heart handleDestroy={this.handleDestroy.bind(this)} state={this.state} />
				</ComponentMap>
				<Cursor state={this.state} w={8} h={8} />
			</layer >
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