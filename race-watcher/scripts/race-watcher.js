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
			const race = msg.race;
			console.log(race);	// For testing purposes
			// Check if anyone's finished or quit/unquit
			if(race.entrants_count_finished != finished) {
				// Someone new finished
				if(race.entrants_count_finished > finished) {
					playerFinished(race);
					finished++;
				}
				// .undone
				else {
					playerUndone(race);
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
					playerUndone(race);
					quit--;
				}
			}
		}
	};
}

function playerFinished(race) {
	var newDone = "";
	for(i = 0; i < race.entrants_count_finished; i++) {
		var racer = race.entrants[i];
		if(racer.status != "done") {
			continue;
		}
		newDone = racer.place_ordinal + " " + racer.user.name + " - " + racer.finish_time;
	}
	const p = document.createElement("p");
	p.innerHTML = newDone;
	document.getElementById("done").appendChild(p);
}

function playerQuit(race) {
	var newQuit = "";
	for(i = 0; i < race.entrants_count_inactive; i++) {
		var racer = race.entrants[i];
		if(racer.status != "dnf" || racer.status != "dq") {
			continue;
		}
		newQuit = racer.status.verbose_value + " " + racer.user.name;
	}
	const p = document.createElement("p");
	p.innerHTML = newQuit;
	document.getElementById("quit").appendChild(p);
}

function playerUndone(race) {
	
}
