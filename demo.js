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
  // TODO: neeed add the call here for page storage
turnJSONtoOjb();
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
  var numberOfPages = 1;	
  for (var i = 0; i < numberOfPages; i++) {
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
//getGists(); // This means the API requests

function turnJSONtoOjb() {
    var pageInfo = null;
    while (pageInfo === null) {
      pageInfo = localStorage.getItem('page0');
      break;
    } 

    var firstStringify = JSON.parse(pageInfo);
    var finalObjectList = JSON.parse(firstStringify);

    ul = document.getElementById('gist-list')
    createGistList(document.getElementById('gist-list'), finalObjectList);
}

function createGistList(ul, objectList) {
  objectList.forEach(function(s) {
    var li = document.createElement('li');
    li.appendChild(liDesc(s));
    ul.appendChild(li);
  });
}

function liDesc(gist) {
  var dl = document.createElement('dl');
  var entry = dlEntry('Desc: ', gist);
  dl.appendChild(entry.dt);
  dl.appendChild(entry.dd);
  return dl;
}

function dlEntry(term, gist) {
  var dt = document.createElement('dt');
  var dd = document.createElement('dd');
  dt.innerText = term;

  var a = document.createElement('a');

  var aText = document.createTextNode(gist.description);
  if (gist.description === "") {
    aText = document.createTextNode('This gist has no description!!!');
  };

  a.setAttribute('href', gist.html_url);
  a.appendChild(aText);
  dd.appendChild(a);
  //dd.innerText = gist.description;
  //dd.baseURI = gist.html_url;
  return  {'dt':dt, 'dd':dd};
}
//turnJSONtoOjb();

// Lets display the results