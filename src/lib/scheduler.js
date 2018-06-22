function Scheduler (screen) {
	let tickPending = false

	let shouldRerender = false
	let shouldMove = false

	let lastTime = null

	function tick (time) {
		const elapsed = lastTime === null ? time : time - lastTime
		if (elapsed > 17) {
			//console.log('Slowed down!')
			//console.log(elapsed)
		}
		lastTime = time
		// call update functions

		console.time('tick')

		// move components
		if (shouldMove) {
			//console.log('gogo move')
			screen.root.recursiveMove()
		}

		// rerender components
		if (shouldRerender) {
			//console.log('gogo rerender')
			screen.root.recursiveRerender()
		}
		
		// draw
		screen.draw()

		console.timeEnd('tick')

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
		//console.log(node)
		if (!tickPending) {
			console.log('GO rerender')
			console.log(node)
			shouldRerender = true
			window.requestAnimationFrame(tick)
			tickPending = true
		} else {
			console.log('already rendering')
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
