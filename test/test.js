jem.on('EvilEvent', {name : 'Serdar'}, function (name, props) {
	console.log("FilteredCallback::EvilEvent Occured!!! ID = " + props.id + " name = " + props.name);
});

jem.on('EvilEvent', function (name, props) {
	console.log("GlobalCallback::EvilEvent Occured!!! ID = " + props.id + " name = " + props.name);
});

jem.on('*', function (name, props) {
	console.log("Global Event Handler * Called for event name = " + name);
});

jem.once('EvilEvent', function (name, props) {
	console.log("Once Callback for event " + name + " executed.");
});


jem.fire('EvilEvent', {id : 1, name : "Ali"});
jem.fire('EvilEvent', {id : 2, name : "Serdar"});
jem.fire('EvilEvent', {id : 3, name : "Mahmut"});
jem.fire('EvilEvent', {id : 4});
jem.fire('EvilEvent', {id : 5});
jem.fire('EvilEvent', {id : 6, name : "Whololo"});
jem.fire('EvilEvent');

jem.fire('EvilEvent', {id : 7, name : "Delayed"}, 2000);
//jem.fire('EvilEvent', {id : 8, name : "Delayed-Scheduled"}, 2000, 2000);

function simpleEventListener(eventName, attributes) {
	alert(eventName + " occured!");
}

$(document).on('click', "#attachTest1.btn-success", function () {
	jem.on('Test1Event', simpleEventListener);
	$(this).removeClass("btn-success").addClass("btn-danger");
});

$(document).on('click', "#attachTest1.btn-danger", function () {
	jem.off('Test1Event', simpleEventListener);
	$(this).removeClass("btn-danger").addClass("btn-success");
});