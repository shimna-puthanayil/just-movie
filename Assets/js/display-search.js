var searchFormEl = $('#search-form');
var resultTextEl = $('#result-content')
var resultContentEl = $('#result-content')

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
        var title = $('<h4>Cast</h4>');
        var details = $('<p>' + movie.overview + '</p>');

        cell.append(card)
        card.append(cardDivider);
        if (movie.poster_path) {
            var image = $('<img src="https://image.tmdb.org/t/p/w500' + movie.poster_path + '">');
            card.append(image);
        }
        cardSection.append(title);
        cardSection.append(details);
        card.append(cardSection);


        // Append the card to the container
        $('#result-content').append(cell);
    })
}

function saveResultsToLocalStorage(resultObj) {
    // Convert the result object to JSON string
    var resultJson = $.stringify(resultObj);
    
    // Save the JSON string to local storage
    localStorage.setItem('searchResults', resultJson);
}

function loadResultsFromLocalStorage() {
    // Retrieve the JSON string from local storage
    var resultJson = localStorage.getItem('searchResults');
    
    // Parse the JSON string to get the result object
    var resultObj = $.parse(resultJson);
    
    if (resultObj) {
      // If results exist, print them on the page
      printResults(resultObj);
    }
}

function searchApi(query) {
    var tmbdQueryUrl = 'https://api.themoviedb.org/3/search/';

    tmbdQueryUrl = tmbdQueryUrl + 'movie?query=' + query + "&page=1" + apiKey;
    console.log(tmbdQueryUrl)

    $.ajax({
        url: tmbdQueryUrl,
        method: 'GET',
        datatype: 'json'})
        .done(function (tmbdRes) {
            resultTextEl.textContent = tmbdRes.query;
            // console.log(tmbdRes);
            console.log(tmbdRes.results);
            // console.log(tmbdRes.results[0].title);

            if (!tmbdRes.results.length) {
                console.log('No results found');
                resultContentEl.html('<h3>no results found, search again!</h3>');
            } else {
                printResults(tmbdRes);
                saveResultsToLocalStorage(tmbdRes);
                }

            })
        .fail(function (error) {
            console.error(error);
        })

        
}

function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = $('#search-input').val();

    if (!searchInputVal) {
        console.error('You need a search input value!');
        return;
    }

    var query = searchInputVal.replace(/\s/g, '+');
    // console.log(query);

    resultContentEl.empty();

    searchApi(query);
}

$(document).ready(function () {
    loadResultsFromLocalStorage();
});

searchFormEl.on('submit', handleSearchFormSubmit)

