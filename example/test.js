// jem.js does not have a jQuery dependency but my DOM has :)

// MUSIC BOX MODULE
$(function () {
	var musicBox = $("#musicModule");
	var startMusicButton = musicBox.find("#startMusic");
	var stopMusicButton = musicBox.find("#stopMusic");
	var nextTrack = musicBox.find("#nextTrack");
	var prevTrack = musicBox.find("#prevTrack");
	var currentMusicEl = musicBox.find("#currentMusic");
	
	var musicFiles = [{
		id: 1,
		author: "Metallica",
		title: "Nothing Else Matters",
		duration: 3000
	}, {
		id: 2,
		author: "Nightwish", 
		title: "Amaranth",
		duration: 2000
	}, {
		id: 3,
		author: "Iron Maiden",
		title: "Fear of the Dark", 
		duration: 4000
	}, {
		id: 4,
		author: "Pentagram",
		title: "Lions in a Cage",
		duration: 3500
	}];
	
	var currentMusic = 0;
	var status = "stopped";
	var startMillis = 0;
	var pauseMillis = 0;
	var timerTick = 0;
	var timer = 0;
	
	function playMusic() {
		var track = musicFiles[currentMusic % musicFiles.length];
		var remainingTime = track.duration;
		
		if (status == 'paused') {
			remainingTime = remainingTime - (pauseMillis - startMillis);
		} else if (status != 'stopped') {
			// it is already playing. no need to do anything
			return;
		}
		
		currentMusicEl.html(track.author + " - " + track.title);
		
		// Assume there is a music player and an mp3 file somewhere.
		// Do something to play the music.
		timerTick = remainingTime;
		timer = setInterval(function () {
			timerTick = timerTick - 20;
			if (timerTick <= 0) {
				clearInterval(timer);
				playNextTrack();
			}
		}, 20);
		status = 'playing';
		
		// Then fire a MusicStatusChangeEvent
		jem.fire("MusicStatusChangeEvent", {status: status, track: track});
	}
	
	function stopMusic() {
		if (status == 'playing' || status == 'paused') {
			clearInterval(timer);
			timerTick = 0;
			status = 'stopped';
			startMillis = (new Date()).getTime();
			pauseMillis = (new Date()).getTime();
			
			var track = musicFiles[currentMusic % musicFiles.length];
			// Fire a MusicStatusChangedEvent
			jem.fire("MusicStatusChangeEvent", {status: status, track: track});
		}
	}
	
	function playNextTrack() {
		stopMusic();
		currentMusic++;
		playMusic();
	}
	
	function playPreviousTrack() {
		stopMusic();
		currentMusic--;
		playMusic();
	}
	
	startMusicButton.click(function () {
		playMusic();
	});
	
	stopMusicButton.click(function () {
		stopMusic();
	});
	
	nextTrack.click(function () {
		playNextTrack();
	});
	
	prevTrack.click(function () {
		playPreviousTrack();
	});
	
	$.each(musicFiles, function (i, track) {
		musicBox.find("#trackList").append("<li>" + track.author + " - " + track.title + "</li>");
	});
});

// MUSIC INFO MODULE
$(function () {
	var myModule = $("#musicStatusModule");
	var musicStatusSpan = myModule.find("#musicStatus");
	var musicAuthor = myModule.find("#musicAuthor");
	var musicTitle = myModule.find("#musicTitle");
	
	jem.on("MusicStatusChangeEvent", function (eventName, attributes) {
		if (attributes.status == "playing") {
			musicStatusSpan.html("Playing");
		} else {
			musicStatusSpan.html("Not Playing");
		}
		
		musicAuthor.html(attributes.track.author);
		musicTitle.html(attributes.track.title);
	});
});

// GLOBAL EVENT LOGGING MODULE
$(function () {
	var myModule = $("#globalEventLoggerModule");
	var mainDiv = myModule.find(".panel-body");
	
	var date = function () {
		var date = new Date();
		var m = date.getMinutes() + "";
		var h = date.getHours() + "";
		var s = date.getSeconds() + "";
		
		m = m.length == 1 ? "0" + m : m;
		h = h.length == 1 ? "0" + h : h;
		s = s.length == 1 ? "0" + s : s;
		
		return h + ":" + m + ":" + s;
	};
	
	jem.on("*", function (eventName, attributes) {
		if (attributes && attributes.status) {
			mainDiv.prepend("<p class='text-danger'>Date: " + date() + ", EventName: " + eventName + ", Status: " + attributes.status + "</p>");
		} else {
			mainDiv.prepend("<p class='text-danger'>Date: " + date() + ", EventName: " + eventName + "</p>");
		}
		
		mainDiv.find('p').slice(10).remove();
	});
});

// MUSIC STATISTICS MODULE
// Calculates how many times you listened to tracks
$(function () {
	var myModule = $("#statisticsModule");
	var tbody = myModule.find("#stats");
	
	var insertStatistics = function (trId, track) {
		var tr = $("<tr></tr>").attr("id", trId);
		tr.append("<td>" + track.author + "</td>");
		tr.append("<td>" + track.title + "</td>");
		tr.append("<td>1</td>");
		tbody.append(tr);
	};
	
	var updateStatistics = function (tr) {
		var elem = $(tr.find("td")[2]);
		var num = parseInt(elem.html());
		elem.html(num + 1);
	};
	
	jem.on("MusicStatusChangeEvent", function (eventName, attributes) {
		if (attributes.status == "playing") {
			var trId = "tr_" + attributes.track.id;
			var tr = tbody.find("#" + trId);
			if (tr.length == 0) {
				insertStatistics(trId, attributes.track);
			} else {
				updateStatistics(tr);
			}
		}
	});
});


















