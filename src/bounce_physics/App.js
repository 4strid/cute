import Cute from '../lib/cute'
import { ComponentMap, Clock } from '../lib/components'
import Square from './components/Square2'
import PauseIcon from './components/PauseIcon'
import Cursor from './components/Cursor'
import { Physics, Collider, WorldBounds } from './components/physics'

const App = Cute({
	render () {
		return (
			<layer>
				<Physics>
					<Collider collider={Square} collidee={Square} bounce={1} reaction={square => square.switchColors()}/>
					<Collider collider={Square} collidee={WorldBounds} bounce={1} reaction={square => square.switchColors()}/>
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
	constructor: function App (props) {
		this.construct(props)
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
			this.squares.remove(evt.component)
		},
	},
	states: {
		Ready () {
			this.on('click', evt => {
				const sideLength = this.randomDimensions()
				this.squares.create({
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
