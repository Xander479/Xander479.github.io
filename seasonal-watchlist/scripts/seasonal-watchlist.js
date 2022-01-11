function main() {
	// Don't do anything if no username entered
	if (document.getElementById('user').value == '') {
		return;
	}

	// Hide user form
	var toHide = document.getElementsByClassName('show');
	for (var i = toHide.length; i > 0; i--) {
		document.getElementsByClassName('show')[0].className = 'hide';
	}

	// TODO: Create 'remember me' checkbox

	const user = document.getElementById('user').value;
	getAiringAnime(user);
}

function getAiringAnime(user) {
	const url = `https://api.myanimelist.net/v2/users/${user}/animelist?fields=status`;
	const clientID = 'b0e1dd7d4941dbe567caa1aaa6da94c5';

	window
    .fetch(url, {
      method: 'GET',
      headers: { 'X-MAL-CLIENT-ID': clientID }
    })
		.then(function (res) {
			// Make sure response status is OK
			if (res.status !== 200) {
				console.error(`Error fetching list. Status code: ${res.status}`);
				return;
			}
			res.json().then(function (data) {
				console.log(data);
			});
		});
}
