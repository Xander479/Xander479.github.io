function main() {
	// Hide slug form
	var toHide = document.getElementsByClassName('show');
	for(var len = toHide.length; len > 0; len--) {
		document.getElementsByClassName('show')[0].className = 'hidden';
	}
}
