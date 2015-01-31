window.onload = function() {
  var numberOfPages = 1;

  //getGists(numberOfPages, true);
  //displayGists(numberInitialPagesToDisplay);
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

function getGists(numberOfPages, refreshGists) {
  // Check if we need to refresh the gists in local storage
  var gistsAlreadyStored = false;
  if (refreshGists === false) {
    // Refresh gists only if any are missing
    gistsAlreadyStored = gistsExistLocally(numberOfPages);
    if (gistsAlreadyStored === true)
    {
      return;
    }
  }

  // Get new gists
	var request = new XMLHttpRequest();
  for (var i = 0; i < numberOfPages; i++) {
    requestGistPage(i);
	}
}

function gistsExistLocally(numberOfPages) {
  var pageName = 'page';
  var pageInfo = null;
  for (var i = 0; i < numberOfPages; i++)
  {
    pageName += i;
    pageInfo = localStorage.getItem(pageName);
    if (pageInfo === null) {
      return false; // All gists do not exist locally
    }
  }
  
  return true; // All required gists exist locally
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

      // If this is the first page, then make sure it gets displayed
      if (pageNumber === 0) {
        displayGists(1);
      }
    }
  }

  request.open('GET', url);
  request.send(); 
}

// Gets the gists onload first
	// Store them on the page or in local storage
	// Can store them as different page objects?
//getGists(); // This means the API requests. move this to onload

function displayGists(pagesToDisplay) {
    // var pageInfo = null;
    // while (pageInfo === null) {
      pageInfo = localStorage.getItem('page0');
    //   break;
    // } 

    var firstStringify = JSON.parse(pageInfo);
    var finalObjectList = JSON.parse(firstStringify);

    ul = document.getElementById('gist-list')
    createGistList(document.getElementById('gist-list'), finalObjectList);
}

function createGistList(ul, objectList) {
  objectList.forEach(function(s) {
    ul.appendChild(liDesc(s));
  });
}

function liDesc(gist) {
  var li = document.createElement('li'); 

  var a = document.createElement('a');
  var aText = document.createTextNode(gist.description);
  if (gist.description === "") {
    aText = document.createTextNode('This gist has no description!!!');
  }

  a.setAttribute('href', gist.html_url);
  a.appendChild(aText);
  li.appendChild(a);
  return li;
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
  return  {'dt':dt, 'dd':dd};
}
//displayGists(1);

// Lets display the results

function testme()
{
  console.log('method execution successful');
  displayGists(1);
}

// How to get value from an element 
function howtocheckboxes() {
  document.getElementById("display_javascript").checked;
}