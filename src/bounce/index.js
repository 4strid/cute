import Cute from '../lib/cute'
import App from './App'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'

Cute.attach(<App/>, document.querySelector('.cute-container'), CANVAS_WIDTH, CANVAS_HEIGHT)
