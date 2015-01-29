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