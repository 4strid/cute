import Cute from '../lib/cute'
import { ComponentMap, Clock } from '../lib/components'
import Square from './components/Square'
import PauseIcon from './components/PauseIcon'
import Cursor from './components/Cursor'
import Physics, { Collider } from './lib/physics'


// TODO make components 100% of the width of their container by default. A node finds out who its parent is
// right before rendering, so this should be ok.

const App = Cute({
	displayName: 'App',
	render () {
		return (
			<layer>
				<Physics>
					<Collider collider={Square} collidee={Square} bounce={1} reaction={this.squareXsquareCollision}/>
					<ComponentMap ref={squares => this.squares = squares}>
						<Square handleDestroy={this.handleDestroy.bind(this)}/>
					</ComponentMap>
				</Physics>
				{this.data.paused && <PauseIcon/>}
				<Cursor w={8} h={8}/>
				<Clock paused={this.data.paused}/>
			</layer>
		)
	},
	data () {
		return {
			paused: false,
		}
	},
	methods: {
		randomDimensions () {
			const MIN_SQUARE_SIZE = 25
			const MAX_SQUARE_SIZE = 75
			return Math.random() * (MAX_SQUARE_SIZE - MIN_SQUARE_SIZE) + MIN_SQUARE_SIZE
		},
		handleDestroy (evt) {
			this.data.squares.destroy(evt.component)
		},
		squareXsquareCollision (collider, collidee, collision) {
			// we actually only need collider, but I figured I'd show you what the rest of the arguments are
			collider.switchColors()
			collidee
			collision
		},
	},
	states: {
		Ready () {
			this.on('click', evt => {
				const sideLength = this.randomDimensions()
				this.data.squares.create({
					// centers the square on the mouse position
					x: evt.localX - sideLength / 2,
					y: evt.localY - sideLength / 2,
					w: sideLength,
					h: sideLength,
				})
			})
			this.on('keydownG', evt => {
				if (evt.key === 'p') {
					this.data.paused = !this.data.paused
				}
			})
		},
	},
})

export default App
