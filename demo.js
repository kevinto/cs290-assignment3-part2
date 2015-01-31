window.onload = function() {
  var numberOfPages = 5;

  getGists(numberOfPages, false);
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
      // This is a refresh, so display first page of gists
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
  var currPageName = '';
  var pageInfo = null;
  for (var i = 0; i < numberOfPages; i++)
  {
    currPageName = pageName + i;
    pageInfo = localStorage.getItem(currPageName);
    if (pageInfo === null || pageInfo.toString() === '""') {
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

function displayGists(pagesToDisplay) {
  // Check if gists exist in local storage
  if (!gistsExistLocally(pagesToDisplay)) {
    return;
  } 

  // Check if number of pages to display is valid
  if (pagesToDisplay < 1 || 5 < pagesToDisplay)
  {
    return;
  }

  removeAllListItems();

  // Put all gist pages to be displayed into one array
  var pageName = 'page';
  var currPgName = '';
  var totalGistArray = new Array();
  for (var i = 0; i < pagesToDisplay; i++)
  {
    currPgName = pageName + i;
    pageInfo = localStorage.getItem(currPgName);

    var unParsedObj = JSON.parse(pageInfo);
    var gistObjs = JSON.parse(unParsedObj);

    gistObjs.forEach(function (singleGist) {
      totalGistArray.push(singleGist);
    })
  }

  var orderedList = document.getElementById('gist-list');
  createGistList(orderedList, totalGistArray);
}

function removeAllListItems() {
  var ul = document.getElementById('gist-list');
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
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

function requeryResults()
{
  var numPgToDisplay = document.getElementById('numerical_input').value;
  displayGists(numPgToDisplay);
}
