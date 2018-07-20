import Cute from '../../../lib/cute'

const WorldBounds = Cute({
	render () {
		return <Static proxy={ proxy => proxy(this, 'x', 'y') }/>
	},
})

export default WorldBounds
