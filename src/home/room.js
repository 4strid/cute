import Cute from '../lib/cute'
import Chore from './Chore.js'
import Garbage from './Garbage.js'

const Room = Cute({
  constructor: function Room(props){
       this.construct(props)
       this.Garbage = [
            <Garbage id='x' key='larry' w={100} h={100} />,
            <Garbage key='moe' w={100} h={100} />,
            <Garbage key='curly' w={100} h={100} />,    ]

    this.Chores = [
        <Chore key='laurel' w={100} h={100} x={10} y={10}/>,
        <Chore key='hardy'w={100} h={100} x={200} y={100}/>,]
    
   this.data.visible=true
  
  },

  render() {
    if (!this.data.visible) {
        return <nothing />
    }
    
  	return (
		<layer>
           {this.Chores}
           {this.Garbage}
  		</layer >
    )
  },
  data() {
        return {
            allowance:10,
            s: 0,
            visible: false,
        }
  
  },
  update(time){},
  refresh () {},
  methods: {

    makeVisible(){
        this.data.visible=true
    },
  
  updateScore(time) {
   const { chores, garbage } = this.props
   this.elapsed += time
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
     return s
   }
  }  
})

export default Room