//  Emerald - Create template in html
// Emerald - moment.js time and date (or equivalent)

//  Heather - Call stock API to top 10 trending stock in US market
// stretch goal - allow them to chose their market
// display stocks and company names (as drop down list) 
// make them selectable

// Area of input for user to lookup their stock symbol
// Autocomplete stock symbol lookup
// Store in local storage recently searched stocks
// Stretch goal - allow user to input company name and convert to ticker symbol

// Heather - Call news API with selected stock as parameters
// Present the news articles
// Stretch goal - link to the article

// Stretch - ability to remove stocks from favorites


// Modal popup for search query examples "need help searching" with close button

// Get all dropdowns on the page that aren't hoverable.
const dropdowns = document.querySelectorAll('.dropdown:not(.is-hoverable)');

if (dropdowns.length > 0) {
  // For each dropdown, add event handler to open on click.
  dropdowns.forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      el.classList.toggle('is-active');
    });
  });

  // If user clicks outside dropdown, close it.
  document.addEventListener('click', function(e) {
    closeDropdowns();
  });
}

/*
 * Close dropdowns by removing `is-active` class.
 */
function closeDropdowns() {
  dropdowns.forEach(function(el) {
    el.classList.remove('is-active');
  });
}

// Close dropdowns if ESC pressed
document.addEventListener('keydown', function (event) {
  let e = event || window.event;
  if (e.key === 'Esc' || e.key === 'Escape') {
    closeDropdowns();
  }
});

// set up general variables
var currentDay = document.querySelector("#currentDay");
currentDay.innerHTML = moment().format("dddd, MMMM Do YYYY <br> h:mm:ss a");
const searchButton = document.querySelector("#search-button");
var favoriteStocks = JSON.parse(localStorage.getItem("favoriteStocks"));

// Determine if favoriteStocks is empty or not
if (!favoriteStocks) {
    favoriteStocks = [];
}

// Get favorite stocks out of local storage when page is loaded
showFavoriteStocks(favoriteStocks);

// Set up the help modal
var modal = $('#help-modal')
var helpBtn = $('#helpBtn')
var span = $('#help-close')

helpBtn.on('click', function () {
    modal.addClass('is-active')
});

span.on('click', function () {
    modal.removeClass('is-active')
})

$(window).click(function (event) {
    if (event.target == modal) {
        modal.removeClass('is-active')
    }
})

// Get top 10 gainers in today's market
const key3 = "ff68f94336a3d6f23d221fad0ad0c114";

fetch('https://8ab2843d-3f90-4753-b9ef-06f11ad750c0.mock.pstmn.io/api/v3/stock_market/gainers?apikey=' + key3)
    // fetch('https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=' + key3)
    .then(function (response) {
        return response.json()
    })
    .then(function (topStocks) {
        showTopTen(topStocks)
    })

// Load top stocks into windows
function showTopTen(stock) {
    for (let i = 0; i < 10; i++) {
        var topStock = `<p class="title" onClick="getNews('${stock[i].symbol}')">${stock[i].symbol}</p>`
        var changePercentage = `<p class="subtitle" onClick="getNews('${stock[i].changesPercentage}')">${stock[i].changesPercentage} %⬆︎</p>`
        document.querySelector("#title" + i).innerHTML = topStock;
        document.querySelector("#subtitle" + i).innerHTML = changePercentage;
    }
}

function getNews(topStock) {
    document.querySelector(".news-heading").innerHTML = "News content for: " + topStock;
    window.scrollTo(0, 0); 
    fetch("https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI?q=" + topStock + "&pageNumber=1&pageSize=10&autoCorrect=true&fromPublishedDate=null&toPublishedDate=null", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
            "x-rapidapi-key": "7b71e725f5msh9f62bb1a43745dep1a87a8jsnefdb78a01e7e"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (stockNews) {
            console.log(stockNews);
            showNews(stockNews);
        })
}

// Display Stock News for the Favorites Buttons
function showNews(stockNews) {
    var companyName = document.querySelector(".company-name");
    var newsTitle1 = document.querySelector(".headline1");
    var newsDescription1 = document.querySelector(".description1");
    var url1 = document.querySelector(".url1");
    var body1 = document.querySelector(".body1");

    var newsTitle2 = document.querySelector(".headline2");
    var newsDescription2 = document.querySelector(".description2");
    var url2 = document.querySelector(".url2");
    var body2 = document.querySelector(".body2");

    newsTitle1.innerHTML = "Article Title: " + stockNews.value[0].title
    newsDescription1.innerHTML = "Description: " + stockNews.value[0].description;
    url1.innerHTML = "Article URL: " + stockNews.value[0].url;
    body1.innerHTML = "Article " + stockNews.value[0].body;
    // image1.innerHTML = stockNews.value[0].image.url;

    newsTitle2.innerHTML = "Article Title: " + stockNews.value[1].title
    newsDescription2.innerHTML = "Description: " + stockNews.value[1].description;
    url2.innerHTML = "Article URL: " + stockNews.value[1].url;
    body2.innerHTML = "Article " + stockNews.value[1].body;
}

// Once search button is pressed, go to getFavoriteStock function
searchButton.addEventListener("click", getFavoriteStockNews);

// Store 4 favorite stocks in local storage
function getFavoriteStockNews() {
    var favStock = $("input").val();
    // getNews(favStock);
    if (favoriteStocks.indexOf(favStock) === -1) {
        favoriteStocks.push(favStock);
        localStorage.setItem('favoriteStocks', JSON.stringify(favoriteStocks));
        showFavoriteStocks(favoriteStocks);
        // getNews(favStock);
    }
}

// Update the favorite stock tile and, when clicked, get the news
function showFavoriteStocks() {
    for (let i = 0; i < 6; i++) {
        if (favoriteStocks[i]) {
            var favoriteStock = `<p class="title" onClick="getNews('${favoriteStocks[i]}')">${favoriteStocks[i]}</p>`;
            document.querySelector("#favorite-stock" + i).innerHTML = favoriteStock;
            document.querySelector("#favorite-stock" + i).style.visibility='visible';
        }
        else {
            document.querySelector("#favorite-stock" + i).style.visibility='hidden'; 
        }
    }
}

// Clears local storage
$('#clear').on('click', function () {
    localStorage.clear();
    $("#favorite-stock0").empty();
    $("#favorite-stock1").empty();
    $("#favorite-stock2").empty();
    $("#favorite-stock3").empty();
    $("#favorite-stock4").empty();
    $("#favorite-stock5").empty();
    favoriteStocks = [];
})


// document.addEventListener("click", function(event) {
//     console.log(event.target)
//     if (event.target.classList.contains("title")) {
//     // alert ("I have been clicked")   
//     document.location.replace("./newspage.html")
//     }
//     })