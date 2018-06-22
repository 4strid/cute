import Cute from './cute'

export const ComponentMap = Cute({
	// returns an array of Nodes stored in the map
	render () {
		this._copyProps()
		console.log('aaaaaaaaaaa')
		console.log([...this.data.map.values()])
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
			const combinedProps = {...prototype.props, ...props}
			console.log('bbbbbbbbb')
			console.log(combinedProps)
			const newNode = <prototype.type {...combinedProps} />
			newNode.render(newNode.props)
			console.log('zzzzzzzzzz')
			console.log(newNode)
			const newComponent = newNode.component
			console.log('cccccccccccc')
			console.log(newComponent)
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
