var searchFormEl = $('#search-form');
var resultTextEl = $('#result-content')
var resultContentEl = $('#result-content')
var calloutEl = $('#errorMessage')

var apiKey = '&api_key=533313cc880a2148c77843e769ec1a97';

function getParams() {
    var searchParamsArr = document.location.search.split('=');

    var query = searchParamsArr.pop();
    // console.log(query);

    searchApi(query);
}

function printResults(resultObj) {
    resultObj.results.forEach(function (movie) {
        if (!movie.overview) {
            return;
        }

        var cell = $('<div class="cell"></div>')
        var card = $('<div class="card"></div>');
        var cardDivider = $('<div class="card-divider head-color">' + movie.title + '</div>');
        var cardSection = $('<div class="card-section"></div>');
        var overview = $('<h4>Overview</h4>');
        var details = $('<p>' + movie.overview + '</p>');

        cell.append(card)
        card.append(cardDivider);
        if (movie.poster_path) {
            var posterImg = $('<img src="https://image.tmdb.org/t/p/w500' + movie.poster_path + '">');
            card.append(posterImg);
        } else {
            var posterImg = $('<img src="./Assets/img/no-poster.png">');
            card.append(posterImg);
        }
        cardSection.append(overview);
        cardSection.append(details);
        card.append(cardSection);


        // Append the card to the container
        $('#result-content').append(cell);
    })
}

function saveResultsToLocalStorage(resultObj) {
    // Convert the result object to JSON string
    var resultJson = JSON.stringify(resultObj);
    
    // Save the JSON string to local storage
    localStorage.setItem('searchResults', resultJson);
}

function loadResultsFromLocalStorage() {
    // Retrieve the JSON string from local storage
    var resultJson = localStorage.getItem('searchResults');
    
    // Parse the JSON string to get the result object
    var resultObj = JSON.parse(resultJson);
    
    if (resultObj) {
      // If results exist, print them on the page
      printResults(resultObj);
    }
}

function searchApi(query) {
    var tmbdQueryUrl = 'https://api.themoviedb.org/3/search/';

    tmbdQueryUrl = tmbdQueryUrl + 'movie?query=' + query + "&page=1" + apiKey;
    console.log(tmbdQueryUrl)

    fetch(tmbdQueryUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(tmbdRes => {
            console.log(tmbdRes.results);

            if (!tmbdRes.results.length) {
                console.log('No results found');
                resultContentEl.html('<h3>no results found, search again!</h3>');
            } else {
                printResults(tmbdRes);
                saveResultsToLocalStorage(tmbdRes);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            resultContentEl.html('<h3>Error occurred while fetching search results</h3>');
        });
}

function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = $('#search-input').val();

    if (!searchInputVal) {
        console.error('You need a search input value!');
        var callout = $('<div class="callout alert" data-closable></div>');
        var message = $('<p>You need a search input value!</p>');
        var button = $('<button>', {
            class: 'close-button',
            'aria-label': 'Dismiss alert',
            type: 'button',
            'data-close': ''
        });
        var span = $('<span>', {
            'aria-hidden': 'true',
            html: '&times;'
        });
        button.append(span);
        callout.append(message, button);

        calloutEl.append(callout);
        return;
    }
    var query = searchInputVal.replace(/\s/g, '+');
    // console.log(query);
    var queryString = './display-search.html?q=' + query

    resultContentEl.empty();

    searchApi(query);
}

$(document).ready(function () {
    loadResultsFromLocalStorage();
});

searchFormEl.on('submit', handleSearchFormSubmit)
getParams()
