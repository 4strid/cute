function Dispatch (canvas, screen) {
	// the actual listener we attach to the canvas element. dispatches events
	// to the correct components
	function DispatchEventListener (evtype) {
		return function (evt) {
			dispatch(evtype, evt)
		}
	}

	// all the event types to dispatch
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

	// add actual event listeners to canvas
	allEventTypes.forEach(function (evtype) {
		canvas.addEventListener(evtype, DispatchEventListener(evtype))
	})

	// listeners that reset on every state change
	const ephemeralListeners = {
		// local mouse events, only fired when the mouse is over a component with highest z index
		local: new Map(),
		// local mouse events, only fired when the mouse is over any components
		multi: new Map(),
		// global events, always fired for all components with handlers
		global: {},
	}

	// listeners that persist through state changes
	const persistentListeners = {
		// local mouse events, only fired when the mouse is over a component with highest z index
		local: new Map(),
		// local mouse events, only fired when the mouse is over any components
		multi: new Map(),
		// global events, always fired for all components with handlers
		global: {},
	}

	// set up global listener maps
	allEventTypes.forEach(evtype => {
		ephemeralListeners.global[evtype] = new Map()
		persistentListeners.global[evtype] = new Map()
	})

	// keyboard events do not have clientX and clientY coordinates, so we'll keep track
	// of where the mouse is ourselves to dispatch local keyboard events
	let canvasX = null
	let canvasY = null
	canvas.addEventListener('mousemove', evt => {
		canvas.focus()
		addCanvasCoords(evt)
		canvasX = evt.canvasX
		canvasY = evt.canvasY
	})

	// get the coordinates of the mouse with respect to the canvas
	// TODO: deal with scale / rotation
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

	// get the coordinates of the mouse with respect to a component
	function addLocalCoords (component, evt) {
		evt.localX = evt.canvasX - component.node.screenX
		evt.localY = evt.canvasY - component.node.screenY
	}

	// dispatches event to specified map. map might be 'local' or 'multi'
	function dispatchToMap (map, component, evtype, evt) {
		addLocalCoords(component, evt)
		for (const listeners of [ephemeralListeners, persistentListeners]) {
			const handlers = listeners[map].get(component)
			if (handlers && handlers[evtype]) {
				handlers[evtype].call(component, evt)
			}
		}
	}

	// dispatches local events to ephemeral and persistent local listeners
	function dispatchLocal (component, evtype, evt) {
		if (!component) {
			return
		}
		evt.component = component
		dispatchToMap('local', component, evtype, evt)
	}

	// dispatches events to ephemeral and persistent multi listeners
	function dispatchMulti (components, evtype, evt) {
		components.forEach(component => {
			// this will fail for any asynchronous multi event handler, but events are massive and I don't want to copy the whole thing
			evt.component = component
			dispatchToMap('multi', component, evtype, evt)
		})
	}

	// dispatches events to either ephemeral or persistent global listeners
	function dispatchGlobal (listeners, evtype, evt) {
		listeners.global[evtype].forEach((handler, component) => {
			addLocalCoords(component, evt)
			handler.call(component, evt)
		})
	}

	// mouseover, mouseout, mouseenter, and mouseleaves all require special handling
	// we do it here
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

	// returns whether a compnent has a listener for a given evtype
	function hasLocalListener (component, evtype) {
		for (const listeners of [persistentListeners, ephemeralListeners]) {
			const handlers = listeners.local.get(component)
			if (handlers && handlers[evtype]) {
				return true
			}
		}
		return false
	}

	// the function called when any event is sent to the canvas. determines
	// canvas coordinates, then calls all appropriate handlers
	function dispatch (evtype, evt) {
		// get canvas coordinates of evt
		addCanvasCoords(evt)
		// dispatch event to global handlers
		dispatchGlobal(ephemeralListeners, evtype, evt)
		dispatchGlobal(persistentListeners, evtype, evt)
		// dispatch event to multi handlers
		const allComponents = screen.queryPointAll(evt.canvasX, evt.canvasY)
		dispatchMulti(allComponents, evtype, evt)
		// get topmost component with a handler for the given evtype
		const component = allComponents.find(comp => hasLocalListener(comp, evtype))
		// dispatch event to local handlers
		dispatchLocal(component, evtype, evt)
		// dispatch mouseover, mouseout, mouseenter, and mouseleave events
		dispatchMouseoverMouseout(evtype, evt)
	}

	// attempts to extract an evtype from an evtype of form <evtype>G
	// if it is not a global evtype, returns undefined
	function extractGlobalEvtype (evtype) {
		if (evtype[evtype.length - 1] === 'G') {
			return evtype.substring(0, evtype.length - 1)
		}
	}

	// attempts to extract an evtype from an evtype of form <evtype>M
	// if it is not a multi evtype, returns undefined
	function extractMultiEvtype (evtype) {
		if (evtype[evtype.length - 1] === 'M') {
			return evtype.substring(0, evtype.length - 1)
		}
	}

	// adds the listener to the specified map. this might be a persistent,
	// ephemeral, local, or multi listener
	function addListenerToMap (map, component, evtype, handler) {
		if (!map.has(component)) {
			const handlers = {}
			map.set(component, handlers)
		}
    map.get(component)[evtype] = handler
	}

	// adds a listener to ephemeral or persistent listener containers
	function addListener (listeners, component, evtype, handler) {
		const globalEvtype = extractGlobalEvtype(evtype)
		if (globalEvtype !== undefined) {
			return listeners.global[globalEvtype].set(component, handler)
		}
		const multiEvtype = extractMultiEvtype(evtype)
		if (multiEvtype !== undefined) {
			return addListenerToMap(listeners.multi, component, evtype, handler)
		}
		addListenerToMap(listeners.local, component, evtype, handler)
	}

	// adds an ephemeral listener
	this.addEventListener = function (component, evtype, handler) {
		addListener(ephemeralListeners, component, evtype, handler)
	}

	// adds a persistent listener
	this.addPersistentListener = function (component, evtype, handler) {
		addListener(persistentListeners, component, evtype, handler)
	}

	// helper function that removes a listener from either ephemeral or persistent listeners
	function removeListener (listeners, component, evtype) {
		const globalEvtype = extractGlobalEvtype(evtype)
		if (globalEvtype !== undefined) {
			return listeners.global[globalEvtype].delete(component)
		}
		// we determine whether to remove a local or multi listener
		let map = listeners.local
		let targetEvtype = evtype
		const multiEvtype = extractMultiEvtype(evtype)
		if (multiEvtype !== undefined) {
			map = listeners.multi
			targetEvtype = multiEvtype
		}
		// and then remove it here
		map.get(component)[targetEvtype] = undefined
	}

	// public method for removing a listener
	this.removeEventListener = function (component, evtype) {
		removeListener(ephemeralListeners, component, evtype)
	}

	// public method for removing a persistent listener
	this.removePersistentListener = function (component, evtype) {
		removeListener(persistentListeners, component, evtype)
	}

	// helper functino that removes all listeners from either ephemeral or persistent listeners
	function removeListeners (listeners, component) {
		listeners.local.delete(component)
		listeners.multi.delete(component)
		for (const evtype in listeners.global) {
			listeners.global[evtype].delete(component)
		}
	}

	// public method for removing all event listeners
	this.removeEventListeners = function (component) {
		removeListeners(ephemeralListeners, component)
	}

	// public method for removing all persistent listeners
	this.removePersistentListeners = function (component) {
		removeListeners(persistentListeners, component)
	}

	this.removeComponent = function (component) {
		this.removeEventListeners(component)
		this.removePersistentListeners(component)
	}
}

export default Dispatch
