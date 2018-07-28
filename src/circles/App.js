import Cute from '../lib/cute'
import { ComponentMap } from '../lib/components'
import Square from './Square'
import Arc from './Arc'
import Cursor from './Cursor'

const App = Cute({
	// renders some JSX into canvas draw calls. Just like its React counterpart.
	//
	// see lib/components.js for more information about <ComponentMap>
	render() {
		return (
			<layer>
				<ComponentMap ref={this.data.arcs}>
					<Arc handleDestroy={this.handleDestroy.bind(this)} state={this.state} />
				</ComponentMap>
				<Cursor state={this.state} w={8} h={8} />
			</layer>
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
			// this is like React.createRef() The interface for this will change shortly, but this is how it be for now
			arcs: Cute.createRef(),
		}
	},
	// the methods that each component will have access to. `this` refers to the current component
	methods: {
		randomDimensions() {
			const MIN_ARC_SIZE = 25
			const MAX_ARC_SIZE = 75
			return Math.random() * (MAX_ARC_SIZE - MIN_ARC_SIZE) + MIN_ARC_SIZE
		},
		handleDestroy(evt) {
			// a useful property added to the JS event is evt.component, the component that the
			// event was dispatched to. passed here to ComponentMap.destroy to remove that element from the map
			this.data.arcs.destroy(evt.component)
		},
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
			//this.data.squares.create({x: 50, y: 50, w: 100, h: 100})
			//this.data.squares.create({x: 100, y: 100, w: 75, h: 75})
			//this.data.squares.create({x: 300, y: 100, w: 90, h: 90})
			// TODO
			// hmmmm squares hasn't been rendered yet so this doesn't work.
			// need some kind of "has rendered for the first time" callback
			this.ChangeColors()
		},
		ChangeColors() {
			// attach event handlers just like in vanilla javascript with `this.on('evtype', handler)`
			//
			// you can add M or G to the end to indicate that it should target multiple components, or fire globally.
			// without a modifier, events will only fire if your mouse is over a component, and only propogate to the top
			// component your mouse is on
			this.on('keydownG', evt => {
				// evt is the native JS event object, and contains all the useful information you might need
				if (evt.key === 'c') {
					return this.CreateArcs()
				}
				if (evt.key === 'd') {
					return this.DestroyArcs()
				}
			})
		},
		CreateArcs() {
			this.on('keydownG', evt => {
				if (evt.key === 'Escape') {
					return this.ChangeColors()
				}
				if (evt.key === 'd') {
					return this.DestroyArcs()
				}
			})
			this.on('clickG', evt => {
				const radiusLength = this.randomDimensions()
				this.data.arcs.create({
					// appended to the evt object are the useful properties localX, localY
					// which are the coordinates with respect to the current component
					x: evt.localX - radiusLength / 2, // centers the square on the mouse position
					y: evt.localY - radiusLength / 2,
					r: radiusLength,
					sa: 0,
					ea: 2 * Math.PI,
					ccw: false
				})
			})
		},
		DestroyArcs() {
			this.on('keydownG', evt => {
				if (evt.key === 'Escape') {
					return this.ChangeColors()
				}
				if (evt.key === 'c') {
					return this.CreateArcs()
				}
			})
		},
	},
})

export default App
