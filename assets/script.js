let lastSearched = JSON.parse(localStorage.getItem("searchedCities"));

if(lastSearched){
    searchedCitites = [lastSearched]   
} else {
    searchedCitites = []
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
        updateCurrent(response)
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
    city = city.toLowerCase().trim();
    currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=b6a20b6fa343f5f3b06524bb9d62b04b"
    forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + "&appid=b6a20b6fa343f5f3b06524bb9d62b04b"
    displayCity();
    searchedCitites.unshift(city);
    localStorage.setItem("searchedCities", JSON.stringify(searchedCitites))
})


function updateCurrent(response) {
    let dayTime = moment().format('l')
    let lat = response.coord.lat
    let lon = response.coord.lon
    let UVQueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" +lat +"&lon=" + lon + "&appid=b6a20b6fa343f5f3b06524bb9d62b04b"
    $.ajax({
        url: UVQueryURL,
        method: "GET"
    }).then(function(response){
        console.log(response)
        $("#current-uv").text(response.value)

        if(response.value<=2){
            $("#current-uv").css("background-color", "green")
        } else if(response.value<=5){
            $("#current-uv").css("background-color", "yellow")
        }else if(response.value<=7){
            $("#current-uv").css("background-color","orange")
        } else if(response.value<=10){
            $("#current-uv").css("background-color", "red")
        } else if(response.value>10){
            $("#current-uv").css("background-color", "violet")
        }
    })

    $("#city").text(response.name + " " + dayTime)
    let currentTemp = (response.main.temp - 273.15) * (9/5) + 32
    $("#current-temp").text("Temperature: " + currentTemp.toFixed(1) + "°F")
    $("#current-humidity").text("Humidity: " + response.main.humidity + "%")
    let currentWind = (response.wind.speed*2.237).toFixed(1)
    $("#current-wind").text("Wind Speed: " + currentWind + " mph")
    
}
