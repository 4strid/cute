import Cute from '../../../lib/cute'

import Static from './Static'

const WorldBounds = Cute({
	render () {
		return <Static proxy={ proxy => proxy(this, 'x', 'y') }/>
	},
})

export default WorldBounds
