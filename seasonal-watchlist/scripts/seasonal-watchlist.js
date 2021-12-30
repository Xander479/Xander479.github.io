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
}
