import Cute from '../lib/cute'

const Heart = Cute({
	render () {
		return (
			<path>
				<arc x={-(this.props.r)} y={0} r={this.props.r} sa={0.7 * Math.PI} ea={1.95 * Math.PI} ccw={this.props.ccw} />
				<arc x={this.props.r * 2 - (this.props.r)} y={0} r={this.props.r} sa={1.05 * Math.PI} ea={0.3 * Math.PI} ccw={this.props.ccw} />
				<line x={0} y={this.props.r} />
				<close-path />
				{/* <move x={1} y={0} />
				<line x={50} y={0} /> */}
				<fill color={this.data.color} />
				<stroke color={'black'} />
			</path>
		)
	},
	data () {
		return {
			color: this.randomColor(),
		}
	},
	methods: {
		randomColor () {
			return '#' + Math.floor(Math.random() * 16777215).toString(16)
		},
	},
	states: {
		ChangeColors () {
			this.on('click', () => {
				this.data.color = this.randomColor()
			})
		},
		CreateHearts () {
			// nothing to do
		},
		DestroyHearts () {
			// this is the same pattern as in React: pass a handler down as a prop
			this.on('click', this.props.handleDestroy)
		},
	},
})

export default Heart