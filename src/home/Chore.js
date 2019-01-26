import Cute from '../lib/cute'

const Chore = Cute({
  constructor: function Chore (props) {
    this.construct(props)
    this.elapsed = 0
    this.transitionTime = 3000
  },
	render() {
		return (
			<rect w={this.w} h={this.h} x={0} y={0}>
				<fill color={this.data.color} />
			</rect>
		)
	},
	data() {
		return {
			color: 'green',
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
        switch (this.state.name) {
          case 'Danger0': this.Danger1(); break;
          case 'Danger1': this.Danger2(); break;
          case 'Danger2': this.Danger3(); break;
        }
      }
    },
    refresh () {
      this.elapsed = 0
      this.Danger0()
    },
	},
	states: {
    Ready () {
      this.listen('click', () => {
        this.refresh()
      })
      this.Danger0()
    },
    Danger0 () {
      this.data.color = 'green'
    },
    Danger1 () {
      this.data.color = 'yellow'
    },
    Danger2 () {
      this.data.color = 'red'
    },
    Danger3 () {
      this.data.color = 'black'
    },
	},
})

export default Chore
