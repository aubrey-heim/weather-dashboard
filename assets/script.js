var lastSearched = JSON.parse(localStorage.getItem("searchedCities"));

if(lastSearched){
    searchedCitites = [lastSearched]
    displayCity()
    
} else {
    searchedCitites = []
}
let city = searchedCitites[0]

let currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=b6a20b6fa343f5f3b06524bb9d62b04b"



function displayCity(){
    $.ajax({
        url: currentQueryURL,
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