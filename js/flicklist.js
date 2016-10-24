

var model = {
    watchlistItems: [],
    browseItems: [],
    // DONE
    // add a new field, browseActiveIndex, initially set to 0
    browseActiveIndex: 0
}


var api = {
    root: "https://api.themoviedb.org/3",
    token: "8e888fa39ec243e662e1fb738c42ae99",
    imageBaseUrl: "http://image.tmdb.org/t/p/"
}


function initializePage() {
    // Hook up the Submit Button
    $("#form-search").submit(function (evt) {
        evt.preventDefault();
        var query = $("#search-field").val();
        searchMovies(query, render);
    });

    // initial fetch
    searchMovies("", render);
}

/**
 * Makes an AJAX request to the /discover endpoint of the API, using the 
 * keyword ID that was passed in
 *
 * if successful, updates model.browseItems appropriately and then invokes
 * the callback function that was passed in
 */
function discoverMovies(data, callback) {
    // DONE 
    $.ajax({
        url: api.root + "/discover/movie",
        data: data,
        success: function (response) {
            model.browseItems = response.results;
            // Reset Active Index since browser items were reset
            model.browseActiveIndex = 0;
            callback(response);
        },
        fail: function () {
            console.log("discover failed");
        }
    });
}

function searchMovies(query, callback) {
    fetchKeywords(
      query,
      function (keywordsResponse) {
          console.log("fetch succeeded");
          var firstKeywordId = keywordsResponse.results[0].id;
          var data = {
              api_key: api.token,
              with_keywords: firstKeywordId
          };
          discoverMovies(data, callback);
      },
      function () {
          console.log("fetchkeywords failed");
          var data = {
              api_key: api.token
          };
          discoverMovies(data, callback);
      }
    );
}

/**
 * Makes an AJAX request to the /search/keyword endpoint of the API,
 * using the query string that was passed in
 *
 * if successful, invokes the supplied callback function, passing in
 * the API's response.
 */
function fetchKeywords(query, cbSuccess, cbError) {
    // DONE
    $.ajax({
        url: api.root + "/search/keyword",
        data: {
            api_key: api.token,
            query: query
        },
        success: cbSuccess,
        error: cbError
    });
}


/**
 * re-renders the page with new content, based on the current state of the model
 */
function render() {
    renderCarousel();
    renderWatchlist();
    renderActiveDetails();
}

function renderCarousel() {
    // clear top level carousel element
    $("#movieCarouselOuter").remove();

    // rebuild entire carousel (so searches and 'refreshes' work)
    var carouselChild = $("<ul></ul>")
        .attr("id", "movieCarousel")
        .attr("class", "sky-carousel-container");

    var carouselParent = $("<div></div>")
        .attr("id", "movieCarouselParent")
        .attr("class", "sky-carousel-wrapper")
        .append(carouselChild);

    var carouselOuter = $("<div></div>")
    .attr("id", "movieCarouselOuter")
    .attr("class", "sky-carousel")
    .append(carouselParent);

    $("#movieCarouselHost").append(carouselOuter);

    // insert movie (browse) items
    var numberOfItems = 0;

    model.browseItems.forEach(function (movie, index) {
        numberOfItems += 1;

        var poster = $("<img></img>")
            .attr("width", 200)
            .attr("height", 300)
          .attr("src", posterUrl(movie, "w300"));

        var carouselItem = $("<li></li>")
          .append(poster);

        carouselChild.append(carouselItem);
    });

    // Sky jQuery Carousel
	var carousel = $('.sky-carousel').carousel({
		itemWidth: 200,
		itemHeight: 300,
		distance: 15,
		selectedItemDistance: 20,
		selectedItemZoomFactor: .8,
		unselectedItemZoomFactor: 0.67,
		unselectedItemAlpha: 0.6,
		motionStartDistance: 170,
		topMargin: 119,
		gradientStartPoint: 0.35,
		gradientOverlayColor: "#ffffff",
		gradientOverlaySize: 20,
		reflectionDistance: 1,
		reflectionAlpha: 0.35,
		reflectionVisible: true,
		reflectionSize: 70,
		selectByClick: true,
		navigationButtonsVisible: false
	});

    // Bind the 'itemSelected' event to update movie details
	carousel.on('itemSelected.sc', function (evt) {
		setActiveMovie(evt.item.index());
	});

    // manually select middle item (so the details will match the visible item)
	carousel.select(numberOfItems / 2, 0);

}

function renderWatchlist() {
    // determine watchlist items html 'parent'
    var watchlistItemsContainer = $("#watchlistItems");
    watchlistItemsContainer.html("");

    var watchlistCount = 0;

    // insert watchlist items
    model.watchlistItems.forEach(function (movie) {
        watchlistCount += 1;

        // Build up Actions
        var likeButton = $("<i>thumb_up</i>")
            .attr("class", "tiny material-icons");
        var dislikeButton = $("<i>thumb_down</i>")
            .attr("class", "tiny material-icons");
        var deleteButton = $("<i>delete</i>")
            .attr("class", "tiny material-icons");

        var likeLink = $("<a></a>")
            .attr("href", "#")
            .attr("class", "brown-text text-lighten-3")
            .attr("style", "padding-right: 15px")
            .append(likeButton);
        var dislikeLink = $("<a></a>")
            .attr("href", "#")
            .attr("class", "brown-text text-lighten-3")
            .attr("style", "padding-right: 40px")
            .append(dislikeButton);
        var deleteLink = $("<a></a>")
            .attr("href", "javascript:removeFromWatchlist(" + movie.id + ")")
            .attr("class", "brown-text text-lighten-3")
            .append(deleteButton);

        var actionContainerP = $("<p></p>")
            .append(likeLink)
            .append(dislikeLink)
            .append(deleteLink);
        var actionContainerDiv = $("<div></div>")
            .attr("class", "card-content center-align")
            .append(actionContainerP);

        // Build up Image
        var poster = $("<img></img>")
            .attr("src", posterUrl(movie, "w300"));
        var imageContainerDiv = $("<div></div>")
            .attr("class", "card-image")
            .append(poster);

        // Build up Card
        var cardDiv = $("<div></div>")
            .attr("class", "card hoverable")
            .append(imageContainerDiv)
            .append(actionContainerDiv);
        var outerDiv = $("<div></div>")
            .attr("class", "col s6 m3")
            .append(cardDiv);

        watchlistItemsContainer.append(outerDiv);
    });

    if (watchlistCount > 0) {
        //handle watchlist Badge
        $("#watchlistBadge").show();
        $("#watchlistBadge").text(watchlistCount);
    } else {
        //handle watchlist Badge
        $("#watchlistBadge").hide();

        // handle empty watchlist
        watchlistItemsContainer.append("<center><h5>Add items to your Watchlist</h5></center>");
    }
}

function renderActiveDetails() {
    // Get Active Movie
    var activeMovie = model.browseItems[model.browseActiveIndex];

    $("#activeTitle").text(activeMovie.title);
    $("#activeDescription").text(activeMovie.overview);

    //// disable or enable the Add to Watchlist button depending on
    //// whether the current active movie is already on the user's watchlist
    var alreadyOnWatchlist = model.watchlistItems.indexOf(activeMovie) !== -1;
    if (alreadyOnWatchlist) {
        $("#activeAddToWatchlist").hide();
        $("#activeRemoveFromWatchlist").show();
    } else {
        $("#activeAddToWatchlist").show();
        $("#activeRemoveFromWatchlist").hide();
    }
}

function posterUrl(movie, width) {
    return api.imageBaseUrl + width + "/" + movie.poster_path;
}

function removeFromWatchlist(id) {
    model.watchlistItems = model.watchlistItems.filter(function (item) {
        return item.id !== id;
    });

    renderWatchlist();
    renderActiveDetails();
}

function removeActiveMovieFromWatchlist() {
    var activeMovie = model.browseItems[model.browseActiveIndex];
    removeFromWatchlist(activeMovie.id);
    var $toastContent = $('<span>Removed <u>' + activeMovie.title + '</u> from watchlist</span>');
    Materialize.toast($toastContent, 4000, 'rounded');
}

function addActiveMovie() {
    var activeMovie = model.browseItems[model.browseActiveIndex];
    // Add active movie to watchlist
    model.watchlistItems.push(activeMovie);
    // render active details (to disable add to watchlist)
    renderActiveDetails();
    // render watchlist
    renderWatchlist();

    var $toastContent = $('<span>Added <u>' + activeMovie.title + '</u> to watchlist</span>');
    Materialize.toast($toastContent, 4000, 'rounded');
}

function setActiveMovie(movieIndex) {
    // Store the active movie index on the model
    // render the active movie details
    model.browseActiveIndex = movieIndex;

    renderActiveDetails();
}