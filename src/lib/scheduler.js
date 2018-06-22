function Scheduler (screen) {
	let tickPending = false

	let lastTime = null

	function tick (time) {
		const elapsed = lastTime === null ? time : time - lastTime
		if (elapsed > 14) {
			console.log('Slowed down!')
			console.log(elapsed)
		}
		lastTime = time
		// call update functions
		// rerender components
		screen.root.rerender(screen.root.props)
		
		// draw
		screen.draw()

		tickPending = false
	}

	this.scheduleRender = function (node) {
		if (!tickPending) {
			window.requestAnimationFrame(tick)
			tickPending = true
		}
	}
}

export default Scheduler
