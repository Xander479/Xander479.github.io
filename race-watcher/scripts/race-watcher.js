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
	for(var i = 0; i < race.entrants; i++) {
		var racer = race.entrants[i];
		if(racer.status.value != "done") {
			continue;
		}
		newDone = racer.place_ordinal + " " + racer.user.name + " - " + racer.finish_time;
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
	for(var i = 0; i < race.entrants; i++) {
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
			statusDiv = docu.getElementById("quit");
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
