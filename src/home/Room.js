import Cute from '../lib/cute'
import Chore from './Chore.js'
import Garbage from './Garbage.js'

const Room = Cute({
  constructor: function Room(props){
       this.construct(props)
       
    this.transitionTime = 10000

    this.img = new Image(1066, 600)
    this.img.src = './src/home/assets/Kitchen/StaticKitchen.png'
    setTimeout(() => this.data.imageReady = true, 300)
    

       this.Garbage = [
            <Garbage id='x' key='larry' w={273} h={172} />,
            <Garbage key='moe' w={273} h={172} />,
            <Garbage key='curly' w={273} h={172} />,    ]

    this.Chores = [
        <Chore key='laurel' w={100} h={100} x={10} y={10}/>,
        <Chore key='hardy'w={100} h={100} x={200} y={100}/>,]
    
  },

  render() {
  	return (
		<layer>
           {this.data.imageReady && <image img={this.img} x={0} y={0} /> }
           {this.Chores}
           {this.Garbage}
  		</layer >
    )
  },
  data() {
        return {
            imageReady: false,
            s: 0,
            visible: true,
        }
  },
  update (time) {
    this.updateScore(time)
  },
  methods: {
    makeVisible(){
        this.data.visible=true
    },
  
  updateScore(time) {
    const allowance = 100
   this.elapsed += time
   const chores = this.Chores
   const garbage = this.Garbage
   if (this.elapsed >= this.transitionTime) {
     const thingsToDo = chores.length + garbage.length
     let cleanliness = thingsToDo
     let i = 0
     while (i < chores.length) {
       const { decayLevel } = chores[i]
       if (decayLevel >= 4) {
         cleanliness -= decayLevel - 4
       }
       i++
     }
     for (let i = 0; i < garbage.length; i++) {
       if (garbage[i].visible) {
         cleanliness--
       }
     }
     this.data.s = Math.floor(allowance * cleanliness / thingsToDo)
     this.elapsed = 0
     this.props.updateScore(this.data.s)
   }
  },
  },
})

export default Room
