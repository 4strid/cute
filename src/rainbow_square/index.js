import Cute from '../lib/cute'
import RainbowSquare from './RainbowSquare'

Cute.attach(
	<RainbowSquare x={0} y={50} w={50} h={50}/>,
	document.querySelector('.cute-container'),
	400,
	200
)
