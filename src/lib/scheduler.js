function Scheduler (screen) {
	const renderSchedule = new Map()

	let tickPending = false

	function tick (time) {
		// call update functions
		// rerender components
		// clear screen
		// draw
		tickPending = false
	}

	this.scheduleRender = function (node) {
		renderSchedule.set(node, node)
		if (!tickPending) {
			window.requestAnimationFrame(tick)
			tickPending = true
		}
	}
}

export default Scheduler
