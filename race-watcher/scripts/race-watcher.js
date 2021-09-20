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
	
	ws.onmessage = function (event) {
		const msg = JSON.parse(event.data);
		// Only bother doing something if it's a race update
		if(msg.type == "race.data") {
			console.log(msg.race);	// For testing purposes
			// TODO: logic for displaying racer details
		}
	};
}
