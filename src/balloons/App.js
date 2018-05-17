import Cute from './lib/cute'
import Balloon from './Square'

const App = Cute({
	render () {
		if (this.state.StartMenu) {
			return (
				<layer>
					<text>Welcome to balloons game. Click all the balloons before they reach the top of the screen</text>
					<StartButton onClick={this.Playing} y={100}/>
				</layer>
			)
		}
		if (this.state.Playing) {
			return (
				<layer>
					<text y={0} x='center'>High Score: {this.data.hiscore}</text>
					<text y={50} x='center'>Score: {this.data.score}</text>
					<text y={100} x='center'>Level: {this.data.level}</text>

					<ComponentMap data={this.data} ref='balloons'>
						<Balloon color={this.data.color} onClick={this.balloonClick}/>
					</ComponentMap>
				</layer>
			)
		}
		if (this.state.GameOver) {
			return (
				<layer>
					<text y={0} x='center'>High Score: {this.data.hiscore}</text>
					<text y={50} x='center'>Score: {this.data.score}</text>
					<text y={100} x='center'>Level: {this.data.level}</text>
					<text y='center' x='center' fontSize='large'>Game Over!</text>
					<StartButton y={350} x='center' onClick={this.Playing}/>
				</layer>
			)
		}
	},
	methods: {
		balloonClick (evt) {
			this.data.balloons.destroy(evt.target)
			this.data.score += this.data.level
			if (this.data.hiscore < this.data.score) {
				this.data.hiscore = this.data.score
			}
		},
		randomPosition () {
			return {
				x: Math.random() * this.w,
				y: Math.random() * this.h / 2 + this.h / 2,
			}
		},
		randomColor () {
			return '#' + Math.floor(Math.random() * 16777215).toString(16)
		},
	},
	states: {
		Ready () {
			this.StartMenu()
		},
		StartMenu () {
			// nothing to do
		},
		Playing () {
			this.data.color = this.randomColor()
			for (let i = 0; i < 8 + this.level * 2; i++) {
				this.data.balloons.create(this.randomPosition())
			}
		},
		GameOver () {
			this.data.balloons.clear()
		},
	},
})

export default App
