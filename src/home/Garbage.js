import Cute from '../lib/cute'
import { GAME_WIDTH, GAME_HEIGHT } from './constants'
import {Sound, trashSound} from './Sound.js'

const Garbage = Cute({
  constructor: function garbage  (props) {
    this.construct(props)
    this.elapsed = 0
    this.transitionTime = 5000

    this.img = new Image(243, 172)
    setTimeout(() => { this.data.imageReady = true }, 300)
    this.img.src = './src/home/assets/Trash.png'
  },
	render() {
      if (!this.data.visible) {
          return <nothing />
      }
		return (
      this.data.imageReady ? <image img={this.img} x={0} y={0} /> : <nothing />
		)
	},
    data () {
        return {
            visible: false,
            imageReady: false,
        }
    },
    update (time) {
        this.reappear(time)
	},
	methods: {
        	reappear(time){
                this.elapsed += time
                if(this.elapsed >= this.transitionTime && !this.data.visible){
                    this.elapsed=0
                    this.data.visible=true;
                    this.x = Math.random() * (GAME_WIDTH - this.w)
                    this.y = Math.random() * (GAME_HEIGHT-this.h)
                }
            }
	},
	states: {
    Ready () {
      this.on('click', () => {
        if(this.data.visible) {
            this.data.visible=false
            trashSound.play()
            console.log('trash')
        }
      })
    },
	},
})

export default Garbage
