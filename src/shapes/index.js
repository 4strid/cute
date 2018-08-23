import Cute from '../lib/cute'
import App from './App'

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 300

Cute.attach(<App />, document.querySelector('.cute-container'), CANVAS_WIDTH, CANVAS_HEIGHT)

// do this in JS so I can switch index.js files without editing the HTML file
const instructions = document.createElement('p')
instructions.appendChild(document.createTextNode('Press anywhere in the canvas to change the shapes'))
document.querySelector('body').appendChild(instructions)