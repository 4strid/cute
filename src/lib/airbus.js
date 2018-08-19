const bus = {}

module.exports = {
	bus,
	get (key) {
		return bus[key]
	},
	set (key, value) {
		bus[key] = value
	},
	softSet (key, value) {
		if (!(key in bus)) {
			bus[key] = value
		}
	},
}
