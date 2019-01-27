import Cute from '../lib/cute'

const Score = Cute({
  constructor: function Score(props){
    this.construct(props)
    this.elapsed = 0
    this.transitionTime = 20000

    this.allowance = 10;
  },
  data() {
    return {
      s: 0,
    }
  },
  render() {
    return (
      <layer>
        <text font='40px Arial' fill='blue' x={300} y={50} text={this.data.s}/>
      </layer>
    )
  },
  update(time) {
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
    }
  },
})

export default Score
