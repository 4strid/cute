import Cute from '../lib/cute'
import App from './App'

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400

Cute.attach(<App/>, document.querySelector('.cute-container'), CANVAS_WIDTH, CANVAS_HEIGHT)

// do this in JS so I can switch index.js files without editing the HTML file
const instructions = document.createElement('p')
instructions.appendChild(document.createTextNode('Press \'c\' to enter Create mode, \'d\' to enter Destroy mode, and \'Escape\' to return to Change Colors mode'))
document.querySelector('body').appendChild(instructions)
