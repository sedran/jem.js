jem.js (Javascript Event Manager)
==================================================

This is a Javascipt library which helps us writing event driven Javascript code.
- No dependencies, no jQuery, no other library.
- It is not about the DOM. jem.js is for your custom events.
- Any kind of contribution is welcome.

### Why Events?
Using events instead of calling methods reduces coupling.

Assume that you have two modules in your web page which communicates by calling methods of each other. 
When you want to remove one module from the page, you have to change the code of the other module and test whole page.

With events, however, to remove a module from the page, all you need is to remove the module.

##### Traditional way
As you can see below, when you want to remove moduleA, you need to update moduleB, too.

```javascript
var moduleA = (function () {
	var foo = "foo";
	var bar = "bar";
	
	// some code related to moduleA
	// ...
	
	function updateGUI() {
		alert("foo: " + foo + ", bar: " + bar);
	}
	
	return {
		onBarUpdated: function (newValue) {
			bar = newValue;
			updateGUI();
		},
		
		onFooUpdated: function (newValue) {
			foo = newValue;
			updateGUI();
		}
	};
}());

var moduleB = (function () {
	var foo = "";
	var bar = "";
	
	// some code related to moduleB
	// ...
	
	return {
		updateFoo: function (newValue) {
			foo = newValue;
			// ...
			// do something and notify moduleA
			moduleA.onFooUpdated(foo);
		},
		
		updateBar: function (newValue) {
			bar = newValue;
			// ...
			// do something and notify moduleA
			moduleA.onBarUpdated(bar);
		}
	};
}());
```

##### Using events
Here in this code, you are free to remove any of the modules. There is no moduleA in moduleB and there is no moduleB in moduleA.

```javascript
var moduleA = (function () {
	var foo = "foo";
	var bar = "bar";
	
	// some code related to moduleA
	// ...
	
	function updateGUI() {
		alert("foo: " + foo + ", bar: " + bar);
	}
	
	jem.on('FooUpdated', function (eventName, attributes) {
		foo = attributes.foo;
		updateGUI();
	});
	
	jem.on('BarUpdated', function (eventName, attributes) {
		bar = attributes.bar;
		updateGUI();
	});
	
	return {
		// other module methods.
	};
}());

var moduleB = (function () {
	var foo = "";
	var bar = "";
	
	// some code related to moduleB
	// ...
	
	return {
		updateFoo: function (newValue) {
			foo = newValue;
			// ...
			// do something and fire an event
			jem.fire('FooUpdated', { foo : foo });
		},
		
		updateBar: function (newValue) {
			bar = newValue;
			// ...
			// do something and fire an event
			jem.fire('BarUpdated', { bar : bar });
		}
	};
}());
```


Fire an event!
===========

#### jem.fire(eventName:string)
###### Fire an event without any attribute. The simplest way of firing an event.

```javascript
jem.fire('MessageSentEvent');

jem.fire('RegistrationCompletedEvent');

jem.fire('MusicStartedEvent');
```

#### jem.fire(eventName:string, attributes:object)
###### Fire an event with specific attributes. Event handlers can use this attributes or you can use those attributes to filter events for a specific handler.

```javascript
jem.fire('MessageSentEvent', { message : 'Hello, World',  messageId : 1312});

jem.fire('RegistrationCompletedEvent', { username : 'sedran', name : 'Serdar', surname : 'Kuzucu' });

jem.fire('MusicStartedEvent', { author : 'Metallica', title : 'Am I Evil?' });
```

#### jem.fire(eventName:string, attributes:object, delay:number)
###### Fire an event with specific attributes after a delay.

```javascript
// Fire event after 15 minutes
jem.fire('TimeIsOverEvent', {}, 15 * 60 * 1000);

jem.fire('MessageSentEvent', { message : 'Hello, World',  messageId : 1312}, 100);

jem.fire('RegistrationCompletedEvent', { username : 'sedran', name : 'Serdar', surname : 'Kuzucu' }, 3000);

// Fire event after the current execution finishes
jem.fire('MusicStartedEvent', { author : 'Metallica', title : 'Am I Evil?' }, 0);
```

#### jem.fire(eventName:string, attributes:object, delay:number, rate:number)
###### Fire an event with specific attributes after a delay with a fixed rate.

```javascript
// Fire event after 15 minutes
// Then fire it again every minute
jem.fire('AddToCartEvent', {}, 15 * 60 * 1000, 60 * 1000);

// Fire event after the current execution finishes
jem.fire('SendAlertEvent', { title : 'Are you still here?' }, 10000, 10000);
```


Handle the events!
===========

#### jem.on(eventName:string, callback:function)
###### Attach an event handler for a specific event

```javascript
// Imagine when a new user is registered, 
// you fire UserRegisteredEvent event somewhere in the code
jem.on('UserRegisteredEvent', function (eventName, eventAttributes) {
	// Handle the event
	$(".username").html(eventAttributes.username);
});
```

#### jem.on(eventName:string, filters:object, callback:function)
###### Attach an event handler for a specific event which has specific attributes specified as filters.

```javascript
jem.on('BlogPostedEvent', { category : 'Education' }, function (eventName, eventAttributes) {
	// A blog entry posted by user into the Education category
});
```

#### jem.once(eventName:string, callback:function)
###### Attach a one-time event handler for a specific event.

```javascript
jem.once('BlogPostedEvent', function (eventName, eventAttributes) {
	// A blog entry was posted
	// This code will be called only the first time the event occured.
});
```

#### jem.once(eventName:string, filters:object, callback:function)
###### Attach a one-time event handler for a specific event which has specific attributes specified as filters.

```javascript
jem.once('BlogPostedEvent', { category : 'Education' }, function (eventName, eventAttributes) {
	// A blog entry posted by user into the Education category
	// This code will be called only the first time the event occured.
});
```

Handle multiple events with single handler!
===========

#### jem.on(eventNames:array, callback:function)
###### Attach an event handler for a list of events

```javascript
// Handle both UserLoginEvent and UserSignupEvent with a single callback
jem.on(['UserLoginEvent', 'UserSignupEvent'], function (eventName, eventAttributes) {
	// Handle the event
	$(".username").html(eventAttributes.username);
});
```

#### jem.once(eventNames:array, callback:function)
###### Attach a once time event handler for a list of events

```javascript
// Handle the one that occurs first
jem.once(['UserLoginEvent', 'UserSignupEvent'], function (eventName, eventAttributes) {
	// Handle the event
	$(".username").html(eventAttributes.username);
});
```

Global Event Handler
===========

You can use '*' as an event name to handle all events with a single handler function.

```javascript
jem.on('*', function (eventName, eventAttributes) {
	// All fired events will come here.
});

jem.on('*', {id : 5}, function (eventName, eventAttributes) {
	// All fired events with attribute `id = 5` will come here.
});

// Let's use jem.once
jem.once('*', function (eventName, eventAttributes) {
	// The first fired event will come here
	// And no other event will be handled by this handler
});

jem.once('*', {id : 5}, function (eventName, eventAttributes) {
	// The first fired event with attribute `id = 5` will come here.
	// And no other event will be handled by this handler
});
```


Remove Event Handlers
===========

#### jem.off(eventName:string)
###### Remove all event listeners for a specific event type

```javascript
jem.off('BlogPostedEvent');
```

#### jem.off(eventName:string, handler:function)
###### Remove the specific event listener for a specific event type

```javascript
// Event Handler:
var mHandler = function (eventName, eventAttributes) {
	// does some nasty things here
};

// Register event handler:
jem.on('HelloEvent', mHandler);

// Unregister event handler
jem.off('HelloEvent', mHandler);
```

TODO List
===========
- ~~Listening multiple events with single handler~~
  - ~~Decision: implement one of `jem.on('A,B', handler)` or `jem.on(['A', 'B'], handler)`~~
- ~~Add unit tests~~
- ~~Add demo usages~~
- Add cancellation method for scheduled event firing