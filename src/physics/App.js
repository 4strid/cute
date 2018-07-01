import Cute from '../lib/cute'
import { ComponentMap, Clock } from '../lib/components'
import Square from './Square'
import PauseIcon from './PauseIcon'
import Cursor from './Cursor'



// TODO make components 100% of the width of their container by default. A node finds out who its parent is
// right before rendering, so this should be ok.

const App = Cute({
	displayName: 'App',
	render () {
		return (
			<layer>
				<ComponentMap ref={this.data.squares}>
					<Square handleDestroy={this.handleDestroy.bind(this)}/>
				</ComponentMap>
				{this.data.paused && <PauseIcon/>}
				<Cursor w={8} h={8}/>
				<Clock paused={this.data.paused}/>
			</layer>
		)
	},
	data () {
		return {
			squares: Cute.createRef(),
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
