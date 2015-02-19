jem.js (Javascript Event Manager)
==================================================

This is a Javascipt library which helps us writing event driven Javascript code.
- No dependencies

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

Remove Event Handlers!
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