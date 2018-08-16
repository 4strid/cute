import Cute from '../lib/cute'

const RainbowSquare = Cute({
	constructor: function RainbowSquare (props) {
		this.construct(props)

        this.direction = 1
		this.timerID = window.setInterval(() => {
			this.data.color = (this.data.color + 16) % 0xffffff
		}, 17)
	},
	render () {
		return <fill-rect color={this.formatColor()} />
	},
	data () {
		return {
			color: 0x000000,
		}
	},
	methods: {
		formatColor () {
			// how far left or right the square is
			const hex = this.data.color.toString(16)
			console.log(hex)
			// pad left, and prepend #
			//console.log('-----------')
			//console.log(this.x)
			//console.log(this.w)
			//console.log(ratio)
			//console.log(color)
			//console.log(hex)
			//console.log(6 - hex.length)
			return '#' + '0'.repeat(6 - hex.length) + hex
		},
	}
})

export default RainbowSquare
