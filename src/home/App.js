import Cute from '../lib/cute'
import { ComponentMap, Clock } from '../lib/components'
import Chore from './Chore'
import Cursor from './Cursor'
import Garbage from './Garbage'

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
                <Cursor w={8} h={8} />
                <Garbage w={100} h={100} />
                <Clock />
			</layer >
		)
	},

	data() {
		return {}
	},
	// the methods that each component will have access to. `this` refers to the current component
	methods: {
	},

	states: {
		Ready() {
      // we'll have some states yet
		},
	},
})

export default App
