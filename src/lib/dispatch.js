function Dispatch (canvas, screen) {
	function DispatchEventListener (evtype) {
		return function (evt) {
			dispatch(evtype, evt)
		}
	}

	const allEventTypes = [
		'blur',
		'click',
		'dblclick',
		'focus',
		'keydown',
		'keypress',
		'keyup',
		'mousedown',
		'mouseenter',
		'mouseleave',
		'mousemove',
		'mouseout',
		'mouseover',
		'mouseup',
		'scroll',
		'wheel',
	]

	// local mouse events, only fired when the mouse is over a component with highest z index
	const localListeners = new Map()
	// local mouse events, only fired when the mouse is over any components
	const multiListeners = new Map()
	// global events, always fired for all components with handlers
	const globalListeners = {}
	allEventTypes.forEach(evtype => {
		globalListeners[evtype] = new Map()
	})

	// add actual event listeners to canvas
	allEventTypes.forEach(function (evtype) {
		canvas.addEventListener(evtype, DispatchEventListener(evtype))
	})

	// keyboard events do not have clientX and clientY coordinates, so we'll keep track
	// of where the mouse is ourselves to dispatch local keyboard events
	let canvasX = null
	let canvasY = null
	canvas.addEventListener('mousemove', evt => {
		addCanvasCoords(evt)
		canvasX = evt.canvasX
		canvasY = evt.canvasY
	})

	function addCanvasCoords (evt) {
		if (!evt.clientX) {
			// non-mouse events will not have coordinates
			evt.canvasX = canvasX
			evt.canvasY = canvasY
			return
		}
		const rect = canvas.getBoundingClientRect()
		evt.canvasX = evt.clientX - rect.left
		evt.canvasY = evt.clientY - rect.top
	}

	function addLocalCoords (component, evt) {
		evt.localX = evt.canvasX - component.node.screenX
		evt.localY = evt.canvasY - component.node.screenY
	}

	function dispatchToMap (map, component, evtype, evt) {
		addLocalCoords(component, evt)
		const handlers = map.get(component)
		if (handlers && handlers[evtype]) {
			handlers[evtype].call(component, evt)
		}
	}

	function dispatchMulti (components, evtype, evt) {
		components.forEach(component => {
			dispatchToMap(multiListeners, component, evtype, evt)
		})
	}

	function dispatchLocal (component, evtype, evt) {
		if (component === null) {
			return
		}
		dispatchToMap(localListeners, component, evtype, evt)
	}

	let mousePrior = null
	let mousePriorAll = []

	function dispatchMouseoverMouseout (evtype, evt) {
		const mouseOn = screen.queryPoint(evt.canvasX, evt.canvasY)
		const mouseOver = screen.queryPointAll(evt.canvasX, evt.canvasY)
		if (evtype === 'mousemove') {
			if (mouseOn !== mousePrior) {
				if (mouseOn !== null) {
					dispatchLocal(mouseOn, 'mouseover', evt)
				}
				if (mousePrior !== null) {
					dispatchLocal(mousePrior, 'mouseout', evt)
				}
			}
			mouseOver.forEach(component => {
				if (!mousePriorAll.includes(component)) {
					dispatchLocal(component, 'mouseenter', evt)
				}
			})
			mousePriorAll.forEach(component => {
				if (!mouseOver.includes(component)) {
					dispatchLocal(component, 'mouseleave', evt)
				}
			})
		}
		if (evtype === 'mouseout') {
			if (mousePrior !== null) {
				dispatchLocal(mousePrior, 'mouseout', evt)
			}
			mousePriorAll.forEach(prior => {
				dispatchLocal(prior, 'mouseleave', evt)
			})
		}
		mousePrior = mouseOn
		mousePriorAll = mouseOver
	}

	function dispatch (evtype, evt) {
		// get canvas coordinates of evt
		addCanvasCoords(evt)
		// dispatch event to global handlers
		globalListeners[evtype].forEach((handler, component) => {
			addLocalCoords(component, evt)
			handler.call(component, evt)
		})
		// dispatch event to multi handlers
		const allComponents = screen.queryPointAll(evt.canvasX, evt.canvasY)
		dispatchMulti(allComponents, evtype, evt)
		// dispatch event to local handlers
		const component = screen.queryPoint(evt.canvasX, evt.canvasY)
		dispatchLocal(component, evtype, evt)
		// dispatch mouseover, mouseout, mouseenter, and mouseleave events
		dispatchMouseoverMouseout(evtype, evt)
	}

	function extractGlobalEvtype (evtype) {
		if (evtype[evtype.length - 1] === 'G') {
			return evtype.substring(0, evtype.length - 1)
		}
	}

	function extractMultiEvtype (evtype) {
		if (evtype[evtype.length - 1] === 'M') {
			return evtype.substring(0, evtype.length - 1)
		}
	}

	function addListener (map, component, evtype, handler) {
		if (map.has(component)) {
			map.get(component)[evtype] = handler
		} else {
			const handlers = {}
			handlers[evtype] = handler
			map.set(component, handlers)
		}
	}

	this.addEventListener = function (component, evtype, handler) {
		const globalEvtype = extractGlobalEvtype(evtype)
		if (globalEvtype !== undefined) {
			return globalListeners[globalEvtype].set(component, handler)
		}
		const multiEvtype = extractMultiEvtype(evtype)
		if (multiEvtype !== undefined) {
			return addListener(multiListeners, component, evtype, handler)
		}
		addListener(localListeners, component, evtype, handler)
	}
}

export default Dispatch
