/**
* Saves gists from api.github.com to local storage at page load.
*/
window.onload = function() {
  var numberOfPages = 5;

  getGists(numberOfPages, false);
};

/**
* Sends AJAX calls to get gists.
* @param {int} numberOfPages - Number of pages of gists to get.
* @param {boolean} refreshGists - True, refresh the gists in local
                                  storage. False, do not refresh the
                                  gists if they exist in local storage.
*/
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

/**
* Checks if gists exist in local storage.
* @param {int} numberOfPages - Number of pages of gists to check.
*/
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

/**
* Sets up an AJAX call to a specific gist page.
* @param {int} pageNumber - The gist page to get.
*/
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
  };

  request.open('GET', url);
  request.send();
}

/**
* Displays the gist pages.
* @param {int} pagesToDisplay - Number of pages to display.
*/
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

  removeAllListItems('gist-list');

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

    gistObjs.forEach(function(singleGist) {
      totalGistArray.push(singleGist);
    });
  }

  var filteredGists = getFilteredGists(totalGistArray);
  var finalDisplayList = filterOutFavorites(filteredGists);
  var orderedList = document.getElementById('gist-list');
  createGistList(orderedList, finalDisplayList);
}

/**
* Removes all list items from an HTML list.
* @param {int} listName - Number of pages to display
*/
function removeAllListItems(listName) {
  var list = document.getElementById(listName);
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

/**
* Filters the gists depending on the language settings.
* @param {object[]} unfilteredGists - an array of unfiltered gists.
* @return {object[]} - the gists after filtering.
*/
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
        if (gistFileProp === 'language') {
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

/**
* Adds list elements to the gist results ordered list
* @param {object} ol - the list to add the list elements to.
* @param {object[]} objectList - the objects to add to the list as list elements
*/
function createGistList(ol, objectList) {
  objectList.forEach(function(s) {
    ol.appendChild(liDesc(s, 'favButton'));
  });
}

/**
* Creates a list element from a gist object.
* @param {object} gist - the gist object.
* @param {string} buttonType - the button type to add to the list element.
* @return {object} - the list object to display.
*/
function liDesc(gist, buttonType) {
  var li = document.createElement('li');

  // Create hyperlink
  var a = document.createElement('a');
  var aText = document.createTextNode(gist.description);
  if (gist.description === '') {
    aText = document.createTextNode('no description');
  }
  a.setAttribute('href', gist.html_url);
  a.appendChild(aText);

  // Create favorite button
  var buttonToAdd = document.createElement('input');
  buttonToAdd.type = 'button';
  if (buttonType === 'favButton') {
    buttonToAdd.value = 'Favorite Me';
    buttonToAdd.onclick = addToFavoriteList;
  }
  else if (buttonType === 'removeBtn')
  {
    buttonToAdd.value = 'Remove Me';
    buttonToAdd.onclick = removeFavorite;
  }

  li.appendChild(a);
  li.appendChild(buttonToAdd);
  return li;
}

/**
* Refreshes the gist results.
*/
function requeryResults()
{
  var numPgToDisplay = document.getElementById('numerical_input').value;
  displayGists(numPgToDisplay);
}


/**
* Displays the appropriate favorite list
*/
function checkForFavorites()
{
  if (storedFavListEmpty())
  {
    DisplayEmptyFavoriteList();
  }

  DisplayFavoritesList();
}

/**
* Checks if there are any favorited items.
* @return {boolean} - True, if there are any favorited items.
                      False, if there are no favorited items.
*/
function storedFavListEmpty() {
  var pageInfo = null;
  pageInfo = localStorage.getItem('favlist');
  if (pageInfo === null || pageInfo.toString() === '""') {
    return true; // There are no favorited items
  }

  return false; // There are favorited items
}

/**
* Display an empty favorite list
*/
function DisplayEmptyFavoriteList() {
  removeAllListItems('fav-list');

  var orderedList = document.getElementById('fav-list');

  orderedList.appendChild(createTextLi('There are currently no favorites.'));
}

/**
* Displays the populated favorites list
*/
function DisplayFavoritesList() {
  // Needs to be implemented
  if (storedFavListEmpty())
  {
    return;
  }

  var orderedList = document.getElementById('fav-list');
  var savedFavList = JSON.parse(localStorage.getItem('favlist'));
  for (var i = 0; i < savedFavList.length; i++)
  {
    orderedList.appendChild(liDesc(savedFavList[i], 'removeBtn'));
  }
}

/**
* Creates a list element with text inside of it.
* @param {string} displayText - the display text.
* @return {object} - the list object to display.
*/
function createTextLi(displayText) {
  var li = document.createElement('li');
  li.innerText = displayText;
  return li;
}

/**
* Adds a gist to the favorites list in local storage, displays
* the favorited item in the favorite list, and delete the favorited
* item from the gist results section.
*/
function addToFavoriteList() {
  var favItemDesc = this.parentNode.firstElementChild.innerText;
  var favItemURL = this.parentNode.firstElementChild.getAttribute('href');
  var unsavedFavItem = new favItem(favItemDesc, favItemURL);

  // If no items in fav list, clear it
  if (storedFavListEmpty()) {
    removeAllListItems('fav-list');
  }

  saveFavoritedItem(unsavedFavItem);

  // Display the element in the favorites list
  var orderedList = document.getElementById('fav-list');
  orderedList.appendChild(liDesc(unsavedFavItem, 'removeBtn'));

  // Remove the current list element from the gist results list
  this.parentNode.parentNode.removeChild(this.parentNode);
}

/**
* Creates a new FavItem
* @class
* @property {string} itemDesc - the item description
* @property {string} itemURL - the item url
*/
function favItem(itemDesc, itemURL) {
  this.description = itemDesc;
  this.html_url = itemURL;
}

/**
* Saves a favorited item to local storage.
* @param {object} unsavedFavItem - the gist to save.
*/
function saveFavoritedItem(unsavedFavItem) {
  if (storedFavListEmpty()) {
    // Save the first favorited item
    var initialSavedArray = new Array();
    initialSavedArray.push(unsavedFavItem);
    localStorage.setItem('favlist', JSON.stringify(initialSavedArray));
  }
  else
  {
    // Save to pre-existing list
    var savedFavList = JSON.parse(localStorage.getItem('favlist'));
    savedFavList.push(unsavedFavItem);
    localStorage.setItem('favlist', JSON.stringify(savedFavList));
  }
}

/**
* Unfavorites an item by removing it from the favorites
* local storage, deletes it from the favorites html list,
* and refreshes the gist results (this lets the
* unfavorited item get displayed in the gist results
* again).
*/
function removeFavorite() {
  var favItemURL = this.parentNode.firstElementChild.getAttribute('href');

  if (storedFavListEmpty()) {
    return;
  }

  var indexToRemove = findIdxOfFavoritedItem(favItemURL);

  // Remove the unfavorited item from local storage
  var savedFavList = JSON.parse(localStorage.getItem('favlist'));
  savedFavList.splice(indexToRemove, 1);
  localStorage.setItem('favlist', JSON.stringify(savedFavList));

  // Remove element from displayed favorites list
  this.parentNode.parentNode.removeChild(this.parentNode);

  // Add the removed favorite item back to the gist list
  requeryResults();
}

/**
* Finds the index of the favorited item based on the URL.
* @param {string} favItemURL - the gist URL to find.
*/
function findIdxOfFavoritedItem(favItemURL) {
  var savedFavList = JSON.parse(localStorage.getItem('favlist'));
  for (var i = 0; i < savedFavList.length; i++)
  {
    for (var savedFavProp in savedFavList[i]) {
      if (savedFavProp === 'html_url') {
        if (savedFavList[i][savedFavProp] === favItemURL)
        {
          return i; // Returns the index of the item
        }
      }
    }
  }

  return -1; // Did not find the item
}

/**
* Filters out the favorites from the gist results array
* @param {object[]} filteredGists - the gists that have been
*                                   filtered by language.
* @return {object[]} - the gists to display in the results section
*/
function filterOutFavorites(filteredGists) {
  if (storedFavListEmpty())
  {
    return filteredGists;
  }

  var listWithoutFav = new Array();
  var index = -1;
  for (var i = 0; i < filteredGists.length; i++) {
    index = findIdxOfFavoritedItem(filteredGists[i]['html_url']);

    if (index === -1) {
      listWithoutFav.push(filteredGists[i]);
    }
  }

  return listWithoutFav;
}

/**
* Checks if the user entered the correct page number.
*/
function validatePageNumbers() {
   var pageNum = document.getElementById('numerical_input').value;
   if ((pageNum < 1 || 5 < pageNum) && pageNum !== '') {
    alert('Invalid number entered. ' +
      'Please enter a number between 1 and 5, inclusive.');
   }
}
