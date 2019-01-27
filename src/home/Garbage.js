import Cute from '../lib/cute'
import { GAME_WIDTH, GAME_HEIGHT } from './constants'




const Garbage = Cute({
  constructor: function garbage  (props) {
    this.construct(props)
    this.elapsed = 0
    this.transitionTime = 1000
  },
	render() {
        if (!this.data.visible) {
            return <nothing />
        }
		return (
			<rectangle w={this.w} h={this.h}>
				<fill color='#facade' />
			</rectangle>
		)
	},
    data () {
        return {
            visible: false,
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
            
                   // this.render()
                }
            }
	},
	states: {
    Ready () {
      this.on('click', () => {
        if(this.data.visible) {
            this.data.visible=false
        }
      })
    },
	},
})

export default Garbage
