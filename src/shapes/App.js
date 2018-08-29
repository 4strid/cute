import Cute from '../lib/cute'
import { ComponentMap } from '../lib/components'
import Shape from './Shape'
import Cursor from './Cursor'

const App = Cute({
	render () {
		return (
			<layer>
				<Shape x={this.w / 2} y={this.h / 2} info={this.data.type} />
				<Cursor state={this.state} w={8} h={8} />
			</layer>
		)
	},
	data () {
		return {
			type: 0,
		}
	},
	methods: {
		typeChange () {
			console.log('I\'m being clicked')
			if (this.data.type < 4) {
				this.data.type++
			}
			else if (this.data.type == 4) {
				this.data.type = 0
			}
		},

	},
	states: {
		Ready () {
			this.on('click', () => {
				this.typeChange()
			})
		},
	},
})

export default App
