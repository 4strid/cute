import Cute from '../lib/cute'
import App from './App'

const CANVAS_WIDTH = 700
const CANVAS_HEIGHT = 500

Cute.attach(<App />, document.querySelector('.cute-container'), CANVAS_WIDTH, CANVAS_HEIGHT)
