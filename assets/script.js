let lastSearched = JSON.parse(localStorage.getItem("searchedCities"));

if(lastSearched){
    searchedCitites = [lastSearched[0]]
} else {
    searchedCitites = []
}
let city = searchedCitites[0]

displayCity()

function displayCity(){
    let currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=b6a20b6fa343f5f3b06524bb9d62b04b"
    $.ajax({
        url: currentQueryURL,
        method: "GET"
    }).then(function(response){
        console.log(response)
        let day = moment().format('l')
        $("#city").text(response.name + " " + day)
        let currentTemp = (response.main.temp - 273.15) * (9/5) + 32
        $("#current-temp").text("Temperature: " + currentTemp.toFixed(1) + "°F")
        $("#current-humidity").text("Humidity: " + response.main.humidity + "%")
        let currentWind = (response.wind.speed*2.237).toFixed(1)
        $("#current-wind").text("Wind Speed: " + currentWind + " mph")
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
        forecastQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid=b6a20b6fa343f5f3b06524bb9d62b04b"
        $.ajax({
            url: forecastQueryURL,
            method: "GET"
        }).then(function(response){
            console.log(response)
            for(let i=1; i<6; i++){
                let date = moment().add(i,'days').format('l')
                $("#day"+i).text(date)
                let forecastTemp = (response.daily[i].temp.day - 273.15) * (9/5) + 32
                $("#day"+i+"-temp").text("Temp: " + forecastTemp.toFixed(1) + "°F")
                let iconcode = response.daily[i].weather[0].icon
                $("#weather-icon" + i).attr("src", "http://openweathermap.org/img/w/" + iconcode + ".png").attr("alt", "weather icon")
                let forecastHumidity = (response.daily[i].humidity)
                $("#day"+i+"-humidity").text("Humidity: " + forecastHumidity.toFixed(0) + "%")
            }
        })
    })  
    $("#forecast").removeClass("hidden")
    $("#button-list").empty()
    for (let i=0; i<searchedCitites.length; i++) {
        let buttonEl = $("<button>").attr("type", "button")
        buttonEl.attr("class","btn capital btn-outline-secondary")
        buttonEl.attr("id", searchedCitites[i])
        buttonEl.text(searchedCitites[i])
        $("#button-list").append(buttonEl)
    }
}   
    // let forecastQueryURL = 

$("#search").on("click", function(event){
    event.preventDefault();
    city = $("#search-input").val();
    city = city.toLowerCase().trim();
    currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=b6a20b6fa343f5f3b06524bb9d62b04b"
    forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast/daily?q="+ city + "&appid=b6a20b6fa343f5f3b06524bb9d62b04b"
    searchedCitites.unshift(city);
    displayCity();
    localStorage.setItem("searchedCities", JSON.stringify(searchedCitites))
})
