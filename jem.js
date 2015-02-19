// Everything was started here.
var jem = jem || {};

// Let's keep everything in a dummy function
(function (window, document) {
	// map of event handlers.
	// key is the name of event and value is the list of event handlers
	var eventHandlers = {};
	
	// global event handlers. Every event goes into this.
	eventHandlers["*"] =  [];
	
	// This is a wrapper class to store event handler details
	// eventName: name of the event
	// filters: filter for the event properties
	// callback: callback function to handle event
	var EventHandler = function (eventName, filters, callback, once) {
		this.eventName = eventName;
		this.filters = filters;
		this.callback = callback;
		this.once = once;
	};
	
	// this part was copied from is.js
	// https://github.com/arasatasaygin/is.js
	var toString = Object.prototype.toString;
	var isArray = Array.isArray || function (value) {    // check native isArray first
        return toString.call(value) === '[object Array]';
    };
	
	var addHandler = function (eventName, filters, callback, once) {
		if (!isArray(eventHandlers[eventName])) {
			eventHandlers[eventName] = [];
		}
		
		var handler = new EventHandler(eventName, filters, callback, once);
		eventHandlers[eventName].push(handler);
	};
	
	var checkFilter = function (filters, eventProperties) {
		for (var filter in filters) {
			if (filters.hasOwnProperty(filter)) {
				if (!eventProperties || filters[filter] != eventProperties[filter]) {
					return false;
				}
			}
		}
		return true;
	};
	
	var callHandler = function (fnHandler, eventName, eventProperties) {
		if (typeof fnHandler === 'function') {
			try {
				if (!eventProperties) {
					eventProperties = {};
				}
				fnHandler(eventName, eventProperties);
			} catch (e) {
				// error occured in event handler. skip this handler.
				if (console && console.error) {
					console.error(e);
				}
			}
		}
	};
	
	var callHandlers = function (handlers, eventName, eventProperties) {
		for (var i = 0; i < handlers.length; i++) {
			var handler = handlers[i];
			if ((handler.filters && checkFilter(handler.filters, eventProperties)) || !handler.filters) {
				callHandler(handler.callback, eventName, eventProperties);
				
				if (handler.once === true) {
					handlers.splice(i, 1);
					i--;
				}
			}
		}
	};
	
	var fireEvent = function (eventName, eventProperties) {
		var handlers = eventHandlers[eventName];
		if (isArray(handlers)) {
			callHandlers(handlers, eventName, eventProperties);
		}
		
		var globalHandlers = eventHandlers["*"];
		callHandlers(globalHandlers, eventName, eventProperties);
	};

	/**
	 * Fire an event.
	 * You can use one of those below:
	 * 
	 * jem.fire(eventName)
	 * Fire an event without any attribute
	 *
	 * jem.fire(eventName, eventProperties)
	 * Fire an event with given properties.
	 *
	 * jem.fire(eventName, eventProperties, delay)
	 * Fire an event with given attributes after the specified delay
	 *
	 * jem.fire(eventName, eventProperties, delay, rate)
	 * Fire an event with given attributes after the specified delay and with specified scheduling rate.
	 * The event will be fired again and again at the specified rate.
	 *
	 */
	jem.fire = function (eventName, eventProperties, delay, rate) {
		if (typeof delay === "undefined") {
			fireEvent(eventName, eventProperties);
		} else {
			if (typeof rate === "undefined") {
				setTimeout(function () {
					fireEvent(eventName, eventProperties);
				}, delay);
			} else {
				setTimeout(function () {
					fireEvent(eventName, eventProperties);
					setInterval(function () {
						fireEvent(eventName, eventProperties);
					}, rate);
				}, delay);
			}
		}
	};
	
	/**
	 * Add an event listener for an event.
	 * You can use one of those below:
	 * 
	 * jem.on(eventName, jemCallback)
	 * Attach a callback function for the event
	 *
	 * jem.on(eventName, filters, jemCallback)
	 * Attach a callback function for the event which has the specific properties in filters.
	 *
	 */
	jem.on = function () {
		if (arguments.length < 2)
			throw new Error("1");
			
		if (arguments.length == 2) {
			addHandler(arguments[0], null, arguments[1], false);
		} else {
			addHandler(arguments[0], arguments[1], arguments[2], false);
		}
	};
	
	/**
	 * Add a one time event listener for an event. The listener will be automatically removed after the first call.
	 * You can use one of those below:
	 * 
	 * jem.once(eventName, jemCallback)
	 * Attach a callback function for the event
	 *
	 * jem.once(eventName, filters, jemCallback)
	 * Attach a callback function for the event which has the specific properties in filters.
	 *
	 */
	jem.once = function () {
		if (arguments.length < 2)
			throw new Error("1");
			
		if (arguments.length == 2) {
			addHandler(arguments[0], null, arguments[1], true);
		} else {
			addHandler(arguments[0], arguments[1], arguments[2], true);
		}
	};
	
	/**
	 * Remove an event listener
	 *
	 */
	jem.off = function (eventName, callback) {
		if (typeof callback === 'function') {
			// remove only the specified callback
			var handlers = eventHandlers[eventName];
			if (isArray(handlers)) {
				for (var i = 0; i < handlers.length; i++) {
					var handler = handlers[i];
					if (handler.callback === callback) {
						handlers.splice(i, 1);
						i--;
					}
				}
			}
		} else {
			// no callback was specified. 
			// remove all listeners for the event
			eventHandlers[eventName] = [];
		}
	};
}(window, document));