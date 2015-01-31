window.onload = function() {
  var numberOfPages = 5;

  getGists(numberOfPages, false);
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
  for (var i = 1; i <= numberOfPages; i++) {
    requestGistPage(i);
	}
}

function gistsExistLocally(numberOfPages) {
  var pageName = 'page';
  var currPageName = '';
  var pageInfo = null;
  for (var i = 1; i <= numberOfPages; i++)
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
  for (var i = 1; i <= pagesToDisplay; i++)
  {
    currPgName = pageName + i;
    pageInfo = localStorage.getItem(currPgName);

    var unParsedObj = JSON.parse(pageInfo);
    var gistObjs = JSON.parse(unParsedObj);

    gistObjs.forEach(function (singleGist) {
      totalGistArray.push(singleGist);
    })
  }

  var filteredGists = getFilteredGists(totalGistArray);
  var orderedList = document.getElementById('gist-list');
  createGistList(orderedList, filteredGists);
}

function removeAllListItems() {
  var ul = document.getElementById('gist-list');
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
}

function getFilteredGists(unfilteredGists) {
  var filteredGists = new Array();
  var filterJs = document.getElementById('display_javascript').checked;
  var filterJson = document.getElementById('display_json').checked;
  var filterSql = document.getElementById('display_sql').checked;
  var filterPy = document.getElementById('display_python').checked;

  if (!filterJs && !filterJson && !filterSql && !filterPy) {
    return unfilteredGists;
  }

  for (var i = 0; i < unfilteredGists.length; i++)
  {
    var gistObj = unfilteredGists[i]; 
    var gistFiles = gistObj.files;
    for (var gistFile in gistFiles) {
      // if (gistFiles.hasOwnProperty(prop)) {
      //   console.log("o." + prop + " = " + gistFiles[prop]);
      // }
      var filterLangFound = false;
      var gistFile = gistFiles[gistFile];
      for (var gistFileProp in gistFile) {
        if (gistFileProp === 'language' ) {
          if (filterJs && gistFile['language'] === 'JavaScript') {
            filteredGists.push(gistObj);
            filterLangFound = true;
          }
          else if (filterJson && gistFile['language'] === 'JSON') {
            filteredGists.push(gistObj);
            filterLangFound = true;
          }
          else if (filterSql && gistFile['language'] === 'SQL') {
            filteredGists.push(gistObj);
            filterLangFound = true;
          }
          else if (filterPy && gistFile['language'] === 'Python') {
            filteredGists.push(gistObj);
            filterLangFound = true;
          }

          break;
        }
      }

      if (filterLangFound) {
        break;
      }
    }
  } 

  return filteredGists;
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
    aText = document.createTextNode('no description');
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
