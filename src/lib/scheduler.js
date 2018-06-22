function Scheduler (screen) {
	let tickPending = false

	let shouldRerender = false
	let shouldMove = false

	let lastTime = null

	function tick (time) {
		const elapsed = lastTime === null ? time : time - lastTime
		if (elapsed > 17) {
			console.log('Slowed down!')
			console.log(elapsed)
		}
		lastTime = time
		// call update functions

		// move components
		if (shouldMove) {
			console.log('gogo move')
			screen.root.recursiveMove()
		}

		// rerender components
		if (shouldRerender) {
			console.log('gogo rerender')
			screen.root.recursiveRerender()
		}
		
		// draw
		screen.draw()

		shouldMove = false
		shouldRerender = false
		tickPending = false
	}

	this.scheduleMove = function (node) {
		if (!tickPending) {
			shouldMove = true
			window.requestAnimationFrame(tick)
			tickPending = true
		}
	}

	this.scheduleRender = function (node) {
		console.log('already rendering')
		console.log(node)
		if (!tickPending) {
			console.log('GO rerender')
			console.log(node)
			shouldRerender = true
			window.requestAnimationFrame(tick)
			tickPending = true
		}
	}

	this.scheduleDraw = function (node) {
		if (!tickPending) {
			console.log('GO redraw')
			console.log(node)
			window.requestAnimationFrame(tick)
			tickPending = true
		}
	}
}

export default Scheduler
