function Scheduler (screen) {
	let tickPending = false

	function tick (time) {
		// call update functions
		// rerender components
		screen.root.rerender(screen.root.props)
		
		// draw
	}

	this.scheduleRender = function (node) {
		if (!tickPending) {
			window.requestAnimationFrame(tick)
			tickPending = true
		}
	}
}

export default Scheduler
