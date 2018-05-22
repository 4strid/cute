function Scheduler (screen) {
	const renderSchedule = new Map()

	let tickPending = false
	let drawPending = false

	function tick (time) {
		// call update functions
		// rerender components
		
		
		// draw

		// reset
		renderSchedule.clear()
		tickPending = false
	}

	this.scheduleRender = function (node) {
		renderSchedule.set(node, node)
		if (!tickPending) {
			window.requestAnimationFrame(tick)
			tickPending = true
		}
		drawPending = true
	}
}

export default Scheduler
