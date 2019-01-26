import Cute from '../lib/cute'

const Chore = Cute({
  constructor: function Chore (props) {
    this.construct(props)
    this.elapsed = 0
    this.transitionTime = 3000
    this.decayColors = ['green', 'yellow', 'red', 'black']
  },
	render() {
		return (
			<rect w={this.w} h={this.h} x={0} y={0}>
				<fill color={this.decayColors[this.data.decayLevel]} />
			</rect>
		)
	},
	data() {
		return {
      decayLevel: 0
		}
	},
	update (time) {
    this.decay(time)
	},
	methods: {
    decay (time) {
      this.elapsed += time
      if (this.elapsed >= this.transitionTime) {
        this.elapsed = 0
        this.data.decayLevel++
        if (this.data.decayLevel > 3) {
          this.data.decayLevel = 3
        }
      }
    },
    refresh () {
      this.elapsed = 0
      this.data.decayLevel = 0
    },
	},
	states: {
    Ready () {
      this.on('click', () => {
        this.refresh()
      })
    },
	},
})

export default Chore
