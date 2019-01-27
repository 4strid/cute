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
  },
	render() {
		return (
			<rectangle id='cat' w={this.w} h={this.h}>
				<fill color='purple' />
			</rectangle>
		)
	},
    data () {
        return {
        }
    },
    update (time) {
        this.move()
	},
	methods: {
        	move(){
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
        Ready() {
        },
	},
})

export default Cat
