window.onload = function() {
	document.getElementById('output').innerHTML = 'test';
}

function saveDemoInput() {
	localStorage.setItem('demoText', document.getElementsByName('demo-input')[0].value);
}

function clearLocalStorage() {
	localStorage.clear();
}

function displayLocalStorage() {
	document.getElementById('output').innerHTML = localStorage.getItem('demoText');
}

function getGists() {
	var request = new XMLHttpRequest();
	if (!request) {
		throw 'Unable to create HttpRequest.';
	}

	var url = 'https://api.github.com/gists?page=1'
	request.open('GET', url);
	request.send();

	// Test code to get the data from different pages
	var request2 = new XMLHttpRequest();
	var url = 'https://api.github.com/gists?page=2'
	request2.open('GET', url);
	request2.send();
}

// Gets the gists onload first
	// Store them on the page or in local storage
	// Can store them as different page objects?
getGists();