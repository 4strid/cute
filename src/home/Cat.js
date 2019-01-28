import Cute from '../lib/cute'
import { GAME_WIDTH, GAME_HEIGHT } from './constants'
import {Sound, meowSound} from './Sound.js'

const Cat = Cute({
  constructor: function garbage  (props) {
    this.construct(props)
    this.elapsed = 0
    this.transitionTime = 1000
    this.ver = 1
    this.hor = 1
    this.sit = true
    this.SIT_CHANCE = .001
    this.CHANGE_DIRECTION = .01
    this.FIRE_CHANCE = .0005
    this.MEOW_CHANCE = .001

    this.img = new Image(200, 170)
    setTimeout(() => { this.data.imageReady = true }, 300)
    this.img.src = './src/home/assets/Cat/catstand.png'

  },
	render() {
		return (
      this.data.imageReady ? <image img={this.img} x={this.x / 4 - 200} y={this.y / 4 - 150} /> : <nothing />
		)
	},
    data () {
        return {
          imageReady: false
        }
    },
    update (time) {
        this.move()
	},
	methods: {
        	move(){
                // meow sometimes
                if (Math.random() < this.MEOW_CHANCE)
                    meowSound.play()

                // stop sometimes
                if (Math.random() < this.SIT_CHANCE)
                    this.sit = ! this.sit
                if (this.sit)
                    return
                
                // change direction sometimes
                if (Math.random() < this.CHANGE_DIRECTION)
                    this.ver *= -1 
                if (Math.random() < this.CHANGE_DIRECTION)
                    this.hor *= -1

                // calc new position
                var dx = Math.random() * this.hor
                var dy = Math.random() * this.ver
                if (this.x + dx > 0 && this.x + dx < (GAME_WIDTH - this.w))
                    this.x += dx
                if (this.y + dy > (GAME_HEIGHT/2) && this.y + dy < (GAME_HEIGHT - this.h))
                    this.y += dy
            }
	},
	states: {
    Ready () {
    },
    },
})

export default Cat
