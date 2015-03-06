QUnit.test("tc1 - Listen Event By Name", function(assert) {
	var triggered = 0;
	jem.on('TC1Event', function (eventName, eventAttributes) {
		assert.equal(eventName, 'TC1Event', 'Listening to the correct event name!');
		triggered++;
	});
	
	jem.fire('TC1Event');
	jem.fire('TC1_Wrong_Event');
	
	assert.equal(triggered, 1, "Handler must be triggered only once");
});

QUnit.test("tc2 - Listen Event by Name and Attribute", function(assert) {
	var triggered = 0;
	
	jem.on('TC2Event', {name: 'hello'}, function (eventName, eventAttributes) {
		assert.equal(eventName, 'TC2Event', 'Listening to the correct event name!');
		assert.equal(eventAttributes.name, 'hello', 'Correct event attribute filtered!');
		triggered++;
	});
	
	jem.fire('TC2Event', {name: 'hello'});
	jem.fire('TC2Event', {name: 'Serdar', surname: 'Kuzucu'});
	jem.fire('TC2Event', {color: 'Green', weight: '12gr'});
	jem.fire('TC2Event', {id: 1, name: 'hello'});
	
	assert.equal(triggered, 2, "Handler must be triggered 2 times");
});

QUnit.test("tc3 - Once Listener Test", function(assert) {
	var triggered = 0;
	
	jem.once('TC3Event', function (eventName, eventAttributes) {
		assert.equal(eventName, 'TC3Event', 'Listening to the correct event name!');
		triggered++;
	});
	
	jem.fire('TC3Event', {name: 'hello'});
	jem.fire('TC3Event', {name: 'Serdar', surname: 'Kuzucu'});
	jem.fire('TC3Event', {color: 'Green', weight: '12gr'});
	jem.fire('TC3Event', {id: 1, name: 'hello'});
	
	assert.equal(triggered, 1, "Handler must be triggered once");
});

QUnit.test("tc4 - Once Listener with Filters/Attributes Test", function(assert) {
	var triggered = 0;
	
	jem.once('TC4Event', { id: 1 }, function (eventName, eventAttributes) {
		assert.equal(eventName, 'TC4Event', 'Listening to the correct event name!');
		triggered++;
	});
	
	jem.fire('TC4Event', {name: 'hello'});
	jem.fire('TC4Event', {name: 'Serdar', surname: 'Kuzucu'});
	jem.fire('TC4Event', {id: 1, name: 'abcd'});
	jem.fire('TC4Event', {color: 'Green', weight: '12gr'});
	jem.fire('TC4Event', {id: 1, name: 'hello'});
	
	assert.equal(triggered, 1, "Handler must be triggered once");
});