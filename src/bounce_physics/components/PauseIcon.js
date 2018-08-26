import Cute from '../../lib/cute'

const PauseIcon = props => (
	<path>
		<rect x={props.w / 2 - 20 - 20} y={props.h / 2 - 30} w={20} h={60} />
		<rect x={props.w / 2 + 20 - 20} y={props.h / 2 - 30} w={20} h={60} />
		<fill color='#ffffff'/>
		<stroke color='#000000'/>
	</path>
)

PauseIcon.displayName = 'PauseIcon'

export default PauseIcon
