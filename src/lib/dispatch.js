function Dispatch (canvas, screen) {
	function DispatchEventListener (evtype) {
		return function (evt) {
			dispatch(evtype, evt);
		};
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
		'wheel'
	];

	allEventTypes.forEach(function (evtype) {
		canvas.addEventListener(evtype, DispatchEventListener(evtype));
	});


	function addCanvasCoords (evt) {
		const rect = canvas.getBoundingClientRect();
		evt.canvasX = evt.clientX - rect.left;
		evt.canvasY = evt.clientY - rect.top;
	}

	function addLocalCoords (evt, el) {
		evt.localX = evt.canvasX - el.screen.x;
		evt.localY = evt.canvasY - el.screen.y;
	}

	function dispatch (evtype, evt) {
		// get canvas coordinates of evt
		addCanvasCoords(evt)
		const multi = screen.queryPointMulti(evt.canvasX, evt.canvasY)
		for (const elem of multi) {
			// handleEvent (evtype, evt, multi=true)
			elem.handleEvent(evtype, evt, true)
		}
		const top = screen.queryPoint(evt.canvasX, evt.canvasY)
		if (top !== null) {
			// handleEvent (evtype, evt, multi=false)
			top.handleEvent(evtype, evt, false)
		}
	}

	let mousePrior = null

	function dispatchMouseoverMouseout (evtype, evt) {
		const mouseOn = screen.queryPoint(evt.canvasX, evt.canvasY)
		if (evtype === 'mousemove') {
			if (mouseOn !== mousePrior) {
				if (mouseOn !== null) {
					mouseOn.handleEvent('mouseover', evt, false)
				}
				if (mousePrior !== null) {
					mousePrior.handleEvent('mouseout', evt, false)
				}
			}
		}
		if (evtype === 'mouseout') {
			if (mousePrior !== null) {
				mousePrior.handleEvent('mouseout', evt, false)
			}
		}
		mousePrior = mouseOn
	}
}


function DispatchOLD (canvas, screen) {
	function DispatchEventListener (evtype) {
		return function (evt) {
			dispatch(evtype, evt);
		};
	}

	function DomEventListener (el, evtype) {
		return function (evt) {
			const listener = domListeners.get(el)[evtype]
			if (listener) {
				listener.call(el, evt);
			}
		};
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
		'wheel'
	];
	allEventTypes.forEach(function (evtype) {
		canvas.addEventListener(evtype, DispatchEventListener(evtype));
	});

	// check if mouse left the window
	document.addEventListener('mouseout', function (evt) {
		if (evt.relatedTarget === null) {
			dispatchMouseoverMouseout('mouseout', evt);
		}
	});

	const localListeners = new Map();
	const globalListeners = {};
	allEventTypes.forEach(function (evtype) {
		globalListeners[evtype] = new Map();
	});
	const userListeners = new Map();
	const persistentListeners = new Map();
	const domListeners = new Map();

	let mousePrior = null;

	function dispatch (evtype, evt) {
		addCanvasCoords(evt);

		dispatchGlobal(evtype, evt);
		const el = screen.queryPoint(evt.canvasX, evt.canvasY);
		dispatchLocal(el, evtype, evt);
		if (allEventTypes.indexOf(evtype) === -1) {
			dispatchChild(el, evtype, evt);
		}
		dispatchMouseoverMouseout(evtype, evt);
	}

	function dispatchMouseoverMouseout (evtype, evt) {
		const mouseOn = screen.queryPoint(evt.canvasX, evt.canvasY);
		if (evtype === 'mousemove') {
			if (mouseOn !== mousePrior) {
				dispatchLocal(mouseOn, 'mouseover', evt)
				dispatchLocal(mousePrior, 'mouseout', evt)
			}
		}
		if (evtype === 'mouseout') {
			dispatchLocal(mousePrior, 'mouseout', evt);
		}
		mousePrior = mouseOn;
	}

	function getGlobalEvtype (evtype) {
		if (evtype[evtype.length - 1] === 'G') {
			return evtype.substring(0, evtype.length - 1);
		}
	}

	function dispatchEvent (map, el, evtype, evt, src) {
		src = src || el;
		const listeners = map.get(el);
		if (listeners && listeners[evtype]) {
			listeners[evtype].call(el, evt, src);
		}
	}

	function dispatchGlobal (evtype, evt) {
		const listeners = globalListeners[evtype];
		listeners.forEach(function (listener, el) {
			addLocalCoords(evt, el);
			listener.call(el, evt, el);
		});
	}

	function dispatchLocal (el, evtype, evt) {
		if (!el) {
			return;
		}
		addLocalCoords(evt, el);
		dispatchEvent(localListeners, el, evtype, evt);
	}

	function dispatchChild (el, evtype, evt) {
		if (!el.parent) {
			return;
		}
		dispatchEvent(userListeners, el.parent, evtype, evt, el);
		dispatchEvent(persistentListeners, el.parent, evtype, evt, el);
	}

	function addCanvasCoords (evt) {
		const rect = canvas.getBoundingClientRect();
		evt.canvasX = evt.clientX - rect.left;
		evt.canvasY = evt.clientY - rect.top;
	}

	function addLocalCoords (evt, el) {
		evt.localX = evt.canvasX - el.screen.x;
		evt.localY = evt.canvasY - el.screen.y;
	}

	function addListener(map, el, evtype, listener) {
		if (map.has(el)) {
			map.get(el)[evtype] = listener;
		} else {
			const listeners = {};
			listeners[evtype] = listener;
			map.set(el, listeners);
		}
	}

	Object.assign(this, {
		addEventListener: function (el, evtype, listener) {
			const globalEvtype = getGlobalEvtype(evtype);
			if (globalEvtype) {
				if (allEventTypes.indexOf(globalEvtype) > -1) {
					globalListeners[globalEvtype].set(el, listener);
				} else {
					console.warn('invalid global event type');
				}
			} else {
				if (allEventTypes.indexOf(evtype) > -1) { // local
					addListener(localListeners, el, evtype, listener);
				} else { // user defined
					addListener(userListeners, el, evtype, listener);
				}
			}
		},
		removeEventListener: function (el, evtype) {
			const globalEvtype = getGlobalEvtype(evtype);
			if (globalEvtype) {
				globalListeners[globalEvtype].delete(el);
			} else {
				delete localListeners.get(el)[evtype];
			}
		},
		removeEventListeners: function (el) {
			localListeners.set(el, {});
			userListeners.set(el, {});
			for (const evtype in globalListeners) {
				globalListeners[evtype].delete(el);
			}
			const listeners = domListeners.get(el) || {};
			for (const l in listeners) {
				el.node.removeEventListener(l, listeners[l]);
			}
			domListeners.set(el, {});
		},
		addDomEventListener: function (el, evtype, listener) {
			el.node.addEventListener(evtype, DomEventListener(el, evtype));
			addListener(domListeners, el, evtype, listener);
		},
		addPersistentListener: function (el, evtype, listener) {
			addListener(persistentListeners, el, evtype, listener);
		},
		removePersistentListener: function (el, evtype) {
			if (persistentListeners.has(el)) {
				delete persistentListeners.get(el)[evtype];
			}
		},
		emitEvent: function (el, evtype, args) {
			dispatchChild(el, evtype, args);
		}
	});
}

export default Dispatch
