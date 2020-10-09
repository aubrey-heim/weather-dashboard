var lastSearched = JSON.parse(localStorage.getItem("searchedCities"));

if(lastSearched){
    searchedCitites = [lastSearched]   
} else {
    searchedCitites = [ellensburg]
}
let city = searchedCitites[0]

let currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=b6a20b6fa343f5f3b06524bb9d62b04b"
let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + "&appid=b6a20b6fa343f5f3b06524bb9d62b04b"

displayCity()



function displayCity(){
    $.ajax({
        url: currentQueryURL,
        method: "GET"
    }).then(function(response){
        console.log(response)
        })

    $.ajax({
        url: forecastQueryURL,
        method: "GET"
    }).then(function(response){
        console.log(response)
        })
    
    
}

$("#search").on("click", function(event){
    event.preventDefault();
    city = $("#search-input").val();
    city = city.toLowerCase();
    currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=b6a20b6fa343f5f3b06524bb9d62b04b"
    displayCity();
    searchedCitites.unshift(city);
})





localStorage.setItem("searchedCities", JSON.stringify(searchedCitites))