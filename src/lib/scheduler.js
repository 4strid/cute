function Scheduler (screen) {
	let tickPending = false
	let nextTick = null

	let shouldRerender = false
	let shouldMove = false

	let lastTime = null

	function tick (time) {
		const elapsed = lastTime === null ? 0 : time - lastTime
		if (elapsed > 17) {
			//console.log('Slowed down!')
			//console.log(elapsed)
		}
		lastTime = time
		// call update functions

		console.time('tick')


		screen.renderMap = new Map()

		// rerender components
		if (shouldRerender) {
			//console.log('gogo rerender')
			console.time('rerender')
			screen.root.rerender()
			console.timeEnd('rerender')
		} else if (shouldMove) {
			// move components
			screen.root.recursiveMove()
		}
		
		// draw
		console.time('draw')
		screen.draw()
		console.timeEnd('draw')

		console.timeEnd('tick')

		shouldMove = false
		shouldRerender = false
		tickPending = false

		if (nextTick !== null) {
			shouldMove = !!nextTick.move
			shouldRerender = !!nextTick.rerender
			window.requestAnimationFrame(tick)
			tickPending = true
			nextTick = null
		}
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
			shouldRerender = true
			window.requestAnimationFrame(tick)
			tickPending = true
		} else if (!shouldRerender) {
			// we are in a nonrendering tick, schedule another tick to rerender
			if (nextTick !== null) {
				nextTick.rerender = true
			} else {
				nextTick = {
					rerender: true,
				}
			}
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
