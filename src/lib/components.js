import Cute from './cute'

import uniqid from 'uniqid'

export const Clock = Cute({
	render () {
		if (!this.props.paused) {
			this.node.scheduleUpdate()
		}
		return <nothing />
	},
	data () {
		return {
			time: null,
		}
	},
	update (time) {
		if (!this.props.paused) {
			this.node.scheduleUpdate()
		}
		// ensures the clock is rendered every frame
		// this.data.time = time
	},
})

// a ComponentMap is a convenient way to create / destroy components on the fly, as well
// as setting the props of all the components contained in the map at once.
//
// pass a prototype component in as the single child of a ComponentMap, and pass to that 
// prototype any props that should be shared by all components in the map
//
// call map.create(...) with any remaining props that the component needs
//
// call map.destroy(component) to remove a component from the map
export const ComponentMap = Cute({
	// renders all the nodes contained in the ComponentMap
	render () {
		this._copyProps()
		return <layer>{[...this.data.map.values()]}</layer>
	},
	data () {
		return {
			map: new Map(),
		}
	},
	methods: {
		_getPrototypeNode () {
			if (this.props.children.length !== 1) {
				throw new Error('ComponentMap expects one Component as a child to be used as a prototype')
			}
			return this.props.children[0]
		},
		_copyProps () {
			const prototype = this._getPrototypeNode()
			this.data.map.forEach((_, component) => {
				component._receiveProps(prototype.props)
			})
		},
		create (props) {
			const prototype = this._getPrototypeNode()
			const combinedProps = { ...prototype.props, ...props, key: uniqid() }
			const newNode = <prototype.type {...combinedProps} />
			newNode.render(newNode.props)
			const newComponent = newNode.component
			this.data.map.set(newComponent, newNode)
			this.node.scheduleRender()
		},
		destroy (component) {
			const node = this.data.map.get(component)
			node.destroy()
			this.data.map.delete(component)
			this.node.scheduleRender()
		},
	},
})