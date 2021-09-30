function main() {
	// Hide slug form
	var toHide = document.getElementsByClassName('show');
	for(var len = toHide.length; len > 0; len--) {
		document.getElementsByClassName('show')[0].className = 'hidden';
	}
	
	// Set up websocket
	const wsURL = "wss://racetime.gg/ws/race/" + document.getElementById('slug').value;
	var ws = new WebSocket(wsURL);
	ws.onopen = function () {
		console.log("connection opened");
	};
	ws.onclose = function () {
		console.log("connection closed");
	};
	
	var finished = 0
	var quit = 0;
	ws.onmessage = function (event) {
		// Only bother doing something if it's a race update
		if(JSON.parse(event.data).type == "race.data") {
			const race = JSON.parse(event.data).race;
			console.log(race);	// For testing purposes
			// Check if anyone's finished or quit/unquit
			if(race.entrants_count_finished != finished) {
				// Someone finished
				if(race.entrants_count_finished > finished) {
					playerFinished(race);
					finished++;
				}
				// .undone
				else {
					playerUndone(race, 0);
					finished--;
				}
			}
			else if (race.entrants_count_inactive != quit) {
				// Someone quit
				if(race.entrants_count_inactive > quit) {
					playerQuit(race);
					quit++;
				}
				// .unforfeit
				else {
					playerUndone(race, 1);
					quit--;
				}
			}
		}
	};
}

function playerFinished(race) {
	var newDone = "";
	var racerID = "";
	for(var i = 0; i < race.entrants_count; i++) {
		var racer = race.entrants[i];
		if(racer.status.value != "done") {
			continue;
		}
		newDone = racer.place_ordinal + " " + racer.user.name + " - " + formatDuration(racer.finish_time);
		racerID = racer.user.id;
	}
	const p = document.createElement("p");
	p.innerHTML = newDone;
	p.id = racerID;
	document.getElementById("done").appendChild(p);
}

function playerQuit(race) {
	var newQuit = "";
	var racerID = "";
	for(var i = 0; i < race.entrants_count; i++) {
		var racer = race.entrants[i];
		if(racer.status.value != "dnf" || racer.status.value != "dq") {
			continue;
		}
		newQuit = racer.status.verbose_value + " " + racer.user.name;
		racerID = racer.user.id;
	}
	const p = document.createElement("p");
	p.innerHTML = newQuit;
	p.id = racerID;
	document.getElementById("quit").appendChild(p);
}

// status 0 = .undone; status 1 = .unforfeit
function playerUndone(race, status) {
	var statusDiv;
	switch(status) {
		case 0:
			statusDiv = document.getElementById("done");
			break;
		case 1:
			statusDiv = document.getElementById("quit");
			break;
		default:
			console.log("Invalid value passed to function playerUndone: " + status);
			return;
	}
	// Find the racer who resumed the race
	for(var i = 0; i < statusDiv.children.length; i++) {
		for(var j = 0; j < race.entrants; j++) {
			if(race.entrants[j].status != "in_progress") {
				continue;	// Only look at racers still racing
			}
			if(statusDiv.children[i].id == race.entrants[j].user.id) {
				statusDiv.children[i].remove();	// Found the racer who resumed the race
				return;
			}
		}
	}
}

function formatDuration(duration) {
	const time = duration.substring(indexOf("T") + 1);
	// Parse hours
	var hours = time.substring(0, time.indexOf("H"));
	if(hours.substring(0, 1) == "0") {
		hours = hours.substring(1);
	}
	// Parse minutes
	var minutes = time.substring(time.indexOf("H") + 1, time.indexOf("M"));
	// Parse seconds
	var seconds = time.substring(time.indexOf("M") + 1, time.indexOf("."));
	
	if(hours == "0") {
		return minutes + ":" + seconds;
	}
	return hours + ":" + minutes + ":" + seconds;
}

// Show what the page will look like after a few racers have finished, for cropping purposes etc
function testClick() {
	// Hide slug form
	var toHide = document.getElementsByClassName('show');
	for(var len = toHide.length; len > 0; len--) {
		document.getElementsByClassName('show')[0].className = 'hidden';
	}
	
	// Create a couple of dummy race times
	const racer1 = document.createElement("p");
	racer1.innerHTML = "1st Racer1 - 1:23:45";
	racer1.id = "test1";
	
	const racer2 = document.createElement("p");
	racer2.innerHTML = "dnf Racer2";
	racer2.id = "test2";
	
	const racer3 = document.createElement("p");
	racer3.innerHTML = "2nd Racer3 - 1:25:55";
	racer3.id = "test3";
	
	// Add racers to the page
	document.getElementById("done").appendChild(racer1);
	document.getElementById("quit").appendChild(racer2);
	document.getElementById("done").appendChild(racer3);
}
