import Cute from '../lib/cute'
import App from './App'
import { GAME_WIDTH, GAME_HEIGHT } from './constants'

Cute.attach(<App />, document.querySelector('.cute-container'), GAME_WIDTH, GAME_HEIGHT)
