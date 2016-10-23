

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



function initializePage()
{
    //$("#form-search").submit(function(evt) {
    //    evt.preventDefault();
    //    var query = $("#form-search input[name=query]").val();
    //    searchMovies(query, render);
    //});

    //// DONE
    //// add event handler to the "Add to Watchlist" button
    //$("#add-to-watchlist").click(function() {
    //    addActiveMovie();
    //    render();
    //});

    //// DONE
    //// add event handler for when the carousel has slid
    //$("#browse-carousel").bind("slid.bs.carousel", function() {
    //    console.log("slid");
    //    var newIndex = $("#browse-carousel").find(".active").index();
    //    console.log(newIndex);
    //    model.browseActiveIndex = newIndex;
    //    render();
    //});

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
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
    },
    fail: function() {
      console.log("discover failed");
    }
  });
}


function searchMovies(query, callback) {
  fetchKeywords(
    query, 
    function(keywordsResponse) {
      console.log("fetch succeeded");
      var firstKeywordID = keywordsResponse.results[0].id
      var data = {
        api_key: api.token,
        with_keywords: firstKeywordID
      };
      discoverMovies(data, callback);
    },
    function() {
      console.log("fetchkeywords failed")
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
  //var watchlistElement = $("#section-watchlist ul");
  //var carouselInner = $("#section-browse .carousel-inner");
  //var browseInfo = $("#browse-info");

  //// clear everything
  //watchlistElement.empty();
  //carouselInner.empty();
  //browseInfo.empty();

  //// insert watchlist items
  //model.watchlistItems.forEach(function(movie) {

  //  // panel heading
  //  var title = $("<h5></h5>").text(movie.original_title);  
  //  var panelHeading = $("<div></div>")
  //    .attr("class", "panel-heading")
  //    .append(title);

  //  // panel body
  //  var poster = $("<img></img>")
  //    .attr("src", posterUrl(movie, "w300"));
  //  var panelBody = $("<div></div>")
  //    .attr("class", "panel-body")
  //    .append(poster)
  //    .append(button);

  //  // panel
  //  var panel = $("<div></div>")
  //    .attr("class", "panel panel-default")
  //    .append(panelHeading)
  //    .append(panelBody);


  //  var button = $("<button></button>")
  //    .text("I watched it")
  //    .attr("class", "btn")
  //    .click(function() {
  //      removeFromWatchlist(movie);
  //      render();
  //    })
  //    .hide();

  //  var itemView = $("<li></li>")
  //    .append(panel)
  //    .append(button)
  //    .mouseover(function() {
  //      button.show();
  //    })
  //    .mouseleave(function() {
  //      button.hide();
  //    });

  //  watchlistElement.append(itemView)
  //});


  // insert browse items
  model.browseItems.forEach(function(movie, index) {
    // DONE
    // replace the old ul code with new carousel implementation:
    // create an image with the movie poster
    // wrap the image inside a div
    // append the item into the carousel-inner element

      //movieCarousel

      //<a class="carousel-item" href="#one!"><img src="netflix-logo-gray-3d.png"></a>



      var poster = $("<img></img>")
  .attr("src", posterUrl(movie, "w300"));

      var carouselItem = $("<a></a>")
        .attr("class", "carousel-item")
        .attr("href", "#" + index)
        .append(poster);

      $("#movieCarousel").append(carouselItem);



    // DONE
    // if this index is the current active index,
    // give this item a class attribute of "active"
    //if (index === model.browseActiveIndex) {
    //  carouselItem.attr("class", "item active");
    //}

  });

  $('.carousel').removeClass("initialized");

    // material design Carousel Initialization
  $('.carousel').carousel();

  //// DONE display info for the currently active movie
  //var activeMovie = model.browseItems[model.browseActiveIndex];
  //var title = $("<h3></h3>").text(activeMovie.original_title);
  //var overview = $("<p></p>").text(activeMovie.overview);
  //browseInfo
  //  .append(title)
  //  .append($("<hr/>"))
  //  .append(overview);
  
  //// DONE
  //// disable or enable the Add to Watchlist button depending on
  //// whether the current active movie is already on the user's watchlist
  //var alreadyOnWatchlist = model.watchlistItems.indexOf(activeMovie) !== -1
  //$("#add-to-watchlist").prop("disabled", alreadyOnWatchlist);
}


function posterUrl(movie, width) {
  return api.imageBaseUrl + width + "/" + movie.poster_path;
}


/**
 * removes the given movie from model.watchlistItems
 */
function removeFromWatchlist(movie) {
  // DONE
  model.watchlistItems = model.watchlistItems.filter(function(item) {
    return item !== movie;
  });
}

function addActiveMovie() {
  // DONE
  var activeMovie = model.browseItems[model.browseActiveIndex];
  model.watchlistItems.push(activeMovie);
}
