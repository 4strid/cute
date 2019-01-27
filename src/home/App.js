import Cute from '../lib/cute.js'
import { ComponentMap, Clock } from '../lib/components.js'
import Chore from './Chore.js'
import Garbage from './Garbage.js'
import Cursor from './Cursor.js'

const App = Cute({
  constructor: function App (props) {
    this.construct(props)
    // there's no "on first component render" hook yet (actually no hooks at all!)
    // so we'll just wait a blip...
    /*
     *setTimeout(() => {
     *  this.chores.create({
     *    x: 0,
     *    y: 0,
     *    w: 100,
     *    h: 100
     *  })
     *}, 40)
     */
  },
	// renders some JSX into canvas draw calls. Just like its React counterpart.
	//
	// see lib/components.js for more information about <ComponentMap>
  // we have to include a clock so updates
	render() {
    /*
		 *return (
		 *  <layer>
     *    <ComponentMap ref={cm => this.chores = cm}>
     *      <Chore />
     *    </ComponentMap>
		 *    <Cursor w={8} h={8} />
     *    <Clock />
		 *  </layer >
		 *)
     */
		return (
			<layer>
        <Chore w={100} h={100} x={0} y={0}/>
        <Chore w={150} h={150} x={200} y={200}/>
        <Garbage w={50} h={50} />
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
		return {}
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
