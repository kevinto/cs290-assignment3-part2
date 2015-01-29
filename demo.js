window.onload = function() {
  // for (var i = 0; i < 5; i++) {
  //   var pageName = 'page';
  //   pageName = pageName + i;
  //   var pageInfo = localStorage.getItem('pageName');
  //   if (pageInfo == null)
  //   {
  //     var pageInitValue = {pageName:[]};
  //     localStorage.setItem(pageName, JSON.stringify(pageInitValue));
  //   }
  // }
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
	
  for (var i = 0; i < 5; i++) {
    requestGistPage(i);
	}
	// var url = 'https://api.github.com/gists?page=1'
	// request.open('GET', url);
	// request.send();
}

function requestGistPage(pageNumber) {
  // Test code to get the data from different pages
  var request = new XMLHttpRequest();
  if (!request) {
    throw 'Unable to create HttpRequest.';
  }

  var pageName = 'page' + pageNumber;
  var url = 'https://api.github.com/gists?page=' + pageNumber;

  request.onreadystatechange = function() {
    if (this.readyState == 4)
    {
      localStorage.setItem(pageName, JSON.stringify(this.responseText));
    }
  }

  request.open('GET', url);
  request.send(); 
}
// Gets the gists onload first
	// Store them on the page or in local storage
	// Can store them as different page objects?
getGists();
