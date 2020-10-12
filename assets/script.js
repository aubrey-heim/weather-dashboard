//pulls previously searched cities out of storage
let lastSearched = JSON.parse(localStorage.getItem("searchedCities"));

//creates city variable
let city=""
//creates an array to store all the searched cities and one to store unique cities
let searchedCities = [];
let uniqueCities = [];

//checks if there are any previously searched cities in local storage
if(lastSearched){
    //adds the most recently searched city to the searched cities array
    searchedCities = [lastSearched[0]];
    //sets the city to the first value of searchedCities (the last searched city)
    city = searchedCities[0]
    //calls the function which writes the city info to the page
    displayCity();
}

//creates function to write the city info to the page which is called when the page loads, when the search button is clicked, and when a city button is clicked
function displayCity(){
    //hides the weather dashboard
    $("#forecast").addClass("hidden")
    $("#current").addClass("hidden")
    //creates the endpoint to access current weather info
    let currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=b6a20b6fa343f5f3b06524bb9d62b04b";
    //starts an asynchronous call for current weather info
    $.ajax({
        url: currentQueryURL,
        method: "GET"
        //runs this function once the asynchronous call is complete
    }).then(function(response){
        //pulls the current date
        let day = moment().format('l');
        //displays the date in the city div
        $("#city").text(response.name + " " + day);
        //creates an image element
        let currentWeatherIcon = $("<img>")
        //pulls the icon info out of the ajax response
        let currentIconcode = response.weather[0].icon
        //sets the icon image source to pull from the openwathermap site
        currentWeatherIcon.attr("src", "https://openweathermap.org/img/w/" + currentIconcode + ".png").attr("alt", 
        "weather icon").attr("id", "current-weather-icon");
        //appends the weather icon to the city
        $("#city").append(currentWeatherIcon)
        //pulls the temperature out of the ajax response and converts it to fahrenheit
        let currentTemp = (response.main.temp - 273.15) * (9/5) + 32;
        //sets the text of the current temp element to the temperature pulled above
        $("#current-temp").text("Temperature: " + currentTemp.toFixed(1) + "°F");
        //pulls the humidity from the ajax response and updates the humidity element on the page
        $("#current-humidity").text("Humidity: " + response.main.humidity + "%");
        //pulls the wind speed from the ajax response and converts it to mph
        let currentWind = (response.wind.speed*2.237).toFixed(1);
        //sets the text of the wind element to the wind speed pulled above
        $("#current-wind").text("Wind Speed: " + currentWind + " mph");
        //pulls the latitude and longitude of the city from the ajax response
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        //creates an endpoint to access current uv index data
        let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" +lat +"&lon=" + lon + "&appid=b6a20b6fa343f5f3b06524bb9d62b04b";
        //starts an asynchronous call for current uv index data
        $.ajax({
            url: UVQueryURL,
            method: "GET"
            //runs this function once the asynchronous call is complete
        }).then(function(response){
            //sets the uv element text to the uv data from the asynchronous call
            $("#current-uv").text(response.value);
            //sets the uv index to the appropriate color based on the severity level
            if(response.value<=2){
                $("#current-uv").css("background-color", "green");
            } else if(response.value<=5){
                $("#current-uv").css("background-color", "yellow");
            }else if(response.value<=7){
                $("#current-uv").css("background-color","orange");
            } else if(response.value<=10){
                $("#current-uv").css("background-color", "red");
            } else if(response.value>10){
                $("#current-uv").css("background-color", "violet");
            }
        })
        //removes the hidden class so the updated current weather shows on the page
        $("#current").removeClass("hidden");
        //creates an endpoint to access weather forecast data
        forecastQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid=b6a20b6fa343f5f3b06524bb9d62b04b";
        //starts an asynchronous call for weather forecast data
        $.ajax({
            url: forecastQueryURL,
            method: "GET"
            //runs this function once the asynchronous call is complete
        }).then(function(response){
            //loops through the 5 days in the forecast
            for(let i=1; i<6; i++){
                //takes the current date, and adds the number of days ahead the forecast is
                let date = moment().add(i,'days').format('l');
                //updates the date on the forecast card
                $("#day"+i).text(date);
                //pulls the forecast temp and converts to fahrenheit
                let forecastTemp = (response.daily[i].temp.day - 273.15) * (9/5) + 32;
                //sets the text of the forecast temp element to the temperature pulled above
                $("#day"+i+"-temp").text("Temp: " + forecastTemp.toFixed(1) + "°F");
                //pulls the icon info out of the ajax response
                let iconcode = response.daily[i].weather[0].icon;
                //sets the icon image source to pull from the openwathermap site
                $("#weather-icon" + i).attr("src", "https://openweathermap.org/img/w/" + iconcode + ".png").attr("alt", "weather icon");
                //pulls the humidity from the ajax response and 
                let forecastHumidity = (response.daily[i].humidity);
                //updates the humidity element on the card to the humidty element pulled above
                $("#day"+i+"-humidity").text("Humidity: " + forecastHumidity.toFixed(0) + "%");
                //removes the hidden class so the updated forecast weather shows on the page
                $("#forecast").removeClass("hidden");
            }
        })
    })  
    
    // goes through each of the values in the searchedCities array to only include each value once in the uniqueCities array
    searchedCities.forEach((c) => {
        //checks to see if unique cities already includes that value
        if (!uniqueCities.includes(c)) {
            //if not - adds the value to uniqueCities
            uniqueCities.push(c);
        }
    });
    //clears the button list
    $("#button-list").empty()
    
    //loops through the cities in the unique cities array
    for (let i=0; i<uniqueCities.length; i++) {
        //creates a button element
        let buttonEl = $("<button>").attr("type", "button")
        //updates the class and id of the buttons
        buttonEl.attr("class","btn capital btn-outline-secondary city-button").attr("id", uniqueCities[i])
        //updates the text of the button to the name of the city
        buttonEl.text(uniqueCities[i])
        //appends the new button to the button list
        $("#button-list").append(buttonEl)
    }
 
    //listens for clicks on the city buttons
   $(".city-button").on("click", function(event){
    //prevents the page from the default response
    event.preventDefault()
    //sets the city to the id of the button (the city name)
    city = $(this).attr("id")
    //adds the city to the front of the searched cities list
    searchedCities.unshift(city);
    //calls the function which writes the city info to the page
    displayCity();
    //stores the searchedCities array to local storage
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities))
})
}   
//listens for clicks on the search button
$("#search").on("click", function(event){
    //prevents the page from attempting to submit the form results
    event.preventDefault();
    //sets the current city to the value input
    city = $("#search-input").val();
    //sets the city to lower case and removes extra spaces
    city = city.toLowerCase().trim();
    //adds the new city to the front of the searchedCities array
    searchedCities.unshift(city);
    //clears the form
    $(".form-inline")[0].reset();
    //calls the function which writes the city info to the page
    displayCity();
    //stores the searchedCities array to local storage
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities))
})