import Cute from '../lib/cute'

const Score = Cute({
    constructor: function Score(props){
        this.construct(props)
        this.elapsed = 0
        this.transitionTime = 20000

         
         this.allowance = 10
         this.i
         this.clean
    },
    data(){
        return {
            s: 0,
        }
    },
    render() {
		const { bodies, colors, scale, offset } = this.data;
		console.log(bodies);
		return (
			<layer>
				<text font='40px Arial' fill='blue' x={300} y={50} text={this.data.s}/>
			</layer>
		)
	},
    update(time){
        this.elapsed += time
        if (this.elapsed >= this.transitionTime) {
            this.i=0
            this.clean = true
            while(this.i < 2){
                if((this.Chores[i].decayLevel >= 4)){this.clean = false}
                this.i++
            }
            this.i=0
            while(i<3){
                if((this.Garbage[i].visible)){this.clean = false}
                this.i++
            }
            if(clean){this.data.s+=allowance}
            this.elapsed=0
       }
    
    },

    	
})

export default Score