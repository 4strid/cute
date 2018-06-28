import Cute from '../lib/cute'

const PauseIcon = () => (
	<layer>
		<rect x={this.w / 2 - 30} y={this.h - 30} w={20} h={60}>
			<fill color='#ffffff'/>
			<stroke color='#000000'/>
		</rect>
		<rect x={this.w / 2 + 30} y={this.h - 30} w={20} h={60}>
			<fill color='#ffffff'/>
			<stroke color='#000000'/>
		</rect>
	</layer>
)

export default PauseIcon
