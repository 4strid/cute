// schedules updates, moves, renders, and draws
function Scheduler(screen) {
	const IDLE = 0
	const PENDING = 1
	const UPDATING = 2
	const MOVING = 3
	const RERENDERING = 4
	const DRAWING = 5

	let state = IDLE
	let currentTickShould = []
	let nextTickShould = []

	const actions = []
	actions[UPDATING] = time => {
		screen.root.recursiveUpdate(time)
	}
	actions[MOVING] = () => {
		screen.root.recursiveMove()
		currentTickShould[DRAWING] = true
	}
	actions[RERENDERING] = () => {
		screen.root.rerender()
		currentTickShould[DRAWING] = true
	}
	actions[DRAWING] = () => {
		screen.draw()
	}

	let lastTime = null

	function tick(time) {
		const elapsed = lastTime === null ? 0 : time - lastTime
		if (elapsed > 17) {
			console.log('Slowed down!')
			console.log(elapsed)
		}
		lastTime = time

		for (state = UPDATING; state <= DRAWING; state++) {
			if (currentTickShould[state]) {
				actions[state](elapsed)
			}
		}

		if (nextTickShould.length > 0) {
			currentTickShould = nextTickShould
			nextTickShould = []
			window.requestAnimationFrame(tick)
		} else {
			lastTime = null
			currentTickShould = []
			state = IDLE
		}
	}

	function ScheduleAction(STATE) {
		return node => {
			if (state === IDLE) {
				currentTickShould[STATE] = true
				state = PENDING
				window.requestAnimationFrame(tick)
			} else if (state < STATE) {
				currentTickShould[STATE] = true
			} else {
				nextTickShould[STATE] = true
			}
		}
	}

	this.scheduleUpdate = ScheduleAction(UPDATING)

	this.scheduleMove = ScheduleAction(MOVING)

	this.scheduleRender = ScheduleAction(RERENDERING)

	this.scheduleDraw = ScheduleAction(DRAWING)
}

export default Scheduler
