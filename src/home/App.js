import Cute from '../lib/cute.js'
import { ComponentMap, Clock } from '../lib/components.js'
import Chore from './Chore.js'
import Garbage from './Garbage.js'
import Cursor from './Cursor.js'
import Score from './Score.js'
// import pic from 'https://pbs.twimg.com/profile_images/653345801872084992/2fZZBOGe_400x400.png'

const App = Cute({
  constructor: function App (props) {

    this.sky = new Image(1066, 6666)
    this.sky.onload = () => this.data.imageReady = true
    this.sky.src = './src/home/assets/sky2.jpg'


    this.construct(props)
       this.Garbage = [
            <Garbage id='x' key='larry' w={100} h={100} />,
            <Garbage key='moe' w={100} h={100} />,
            <Garbage key='curly' w={100} h={100} />,
    ]



    this.Chores = [
        <Chore key='laurel' w={100} h={100} x={10} y={10}/>,
        <Chore key='hardy'w={100} h={100} x={200} y={100}/>,
    ]

  },

	render() {
		return (
			<layer>
                {this.data.imageReady && <image img={this.sky} x={0} y={0} /> }
                {this.Chores}
                {this.Garbage}
                <Score garbage={this.Garbage} chores={this.Chores} />
                <Cursor w={8} h={8} />
                <Clock />
			</layer >
		)
	},
	// this is like `state` from React, it contains any data that might change over a component's lifetime
	// you pass a function that returns the object to be used. (familiar to anyone that's used Vue)
	//
	// accessed with this.data
	//
	// there's no such thing as setState: you just set the properties on the data object to trigger a rerender
	data() {
    return {
      imageReady: false
    }
	},
	// the methods that each component will have access to. `this` refers to the current component
	methods: {
	},
	// `state` in Cute has no React counterpart. It represents a finite state machine. Essentially, a component might react
	// to events differently based on what state it is in, so event handlers are called in a State transition function
	// 
	// these functions are attached directly to the component like methods
	//
	// convention is to use capital letters for state transitions to differentiate them from methods
	//
	// you can use this.state to get information about the current state:
	//   - if (this.state.StateName) {...}
	//   - switch (this.state.name) { case 'StateName': ... }
	//
	// Note: it is not necessary to do if (this.state.name === 'StateName'), just poll it directly as shown above
	states: {
		Ready() {
      // we'll have some states yet
		},
	},
})

export default App
