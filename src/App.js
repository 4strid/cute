import Cute, { ComponentMap } from './lib/cute'
import Square from './Square'
import Cursor from './Cursor'



				//<ComponentMap target={this} ref='squares'>
					//<Square handleDestroy={this.handleDestroy} state={this.state}/>
				//</ComponentMap>

const App = Cute({
	render () {
		return (
			<layer>
				<Cursor state={this.state} w={6} h={6}/>
			</layer>
		)
	},
	methods: {
		randomDimensions () {
			const MIN_SQUARE_SIZE = 25
			const MAX_SQUARE_SIZE = 150
			return Math.random() * (MAX_SQUARE_SIZE - MIN_SQUARE_SIZE) + MIN_SQUARE_SIZE
		},
		handleDestroy (evt) {
			this.data.squares.destroy(evt.target)
		},
	},
	states: {
		Ready () {
			//this.data.squares.create({x: 50, y: 50, w: 100, h: 100})
			//this.data.squares.create({x: 100, y: 100, w: 75, h: 75})
			//this.data.squares.create({x: 300, y: 100, w: 90, h: 90})
			//this.ChangeColors()
		},
		ChangeColors () {
			this.on('keydown', evt => {
				if (evt.key === 'c') {
					return this.CreateSquares()
				}
				if (evt.key === 'd') {
					return this.DestroySquares()
				}
			})
		},
		CreateSquares () {
			this.on('keydown', evt => {
				if (evt.key === 'escape') {
					return this.ChangeColors()
				}
				if (evt.key === 'd') {
					return this.DestroySquares()
				}
			})
			this.on('clickG', evt => {
				const sideLength = this.randomDimensions()
				this.data.squares.create({
					// centers the square on the mouse position
					x: evt.localX - sideLength / 2,
					y: evt.localY - sideLength / 2,
					w: sideLength,
					h: sideLength,
				})
			})
		},
		DestroySquares () {
			this.on('keydown', evt => {
				if (evt.key === 'escape') {
					return this.ChangeColors()
				}
				if (evt.key === 'c') {
					return this.CreateSquares()
				}
			})
		},
	},
})

export default App
