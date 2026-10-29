const cityinput = document.getElementById("cityinput");
const searchBtn = document.getElementById("searchBtn");


// search btn eka click krirma....
searchBtn.addEventListener("click", function () {
    const city = cityinput.value.trim();

    if (city === "") {
        return;
    }

    getWeather(city);

});



//enter click karama search wenna...
cityinput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});


// City eke weather data ganna
async function getWeather(city) {
    try {
        const geoURL =
            "https://geocoding-api.open-meteo.com/v1/search?name="
            + encodeURIComponent(city)
            + "&count=1&language=en&format=json";

        const geoResponse = await fetch(geoURL);
        const geoData = await geoResponse.json();


        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;
        const cityName = geoData.results[0].name;
        const country = geoData.results[0].country;

        //API URL
        const weatherURL =
            "https://api.open-meteo.com/v1/forecast?latitude="
            + latitude
            + "&longitude="
            + longitude
            + "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
            + "&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max"
            + "&forecast_days=7"
            + "&timezone=auto";

        //weather data gannwa
        const weatherRespose = await fetch(weatherURL);
        const weatherData = await weatherRespose.json();

        // Temperature display karanawa
        document.getElementById("temperature").textContent = weatherData.current.temperature_2m;

        //humidity display karnn
        document.getElementById("humidity").textContent = weatherData.current.relative_humidity_2m;

        //wind display karnn
        document.getElementById("wind").textContent = weatherData.current.wind_speed_10m;

        //location display
        document.getElementById("location").textContent = cityName + ", " + country;       
     
    } catch (error) {
        console.log("Error:", error);
        alert("Weather data ganna bari una!");
    }

}


//weather icon

function getWeatherDescription(code) {

    if (code === 0) {
        return ["Clear Sky", "☀️"];
    } else if (code === 1 || code === 2) {
        return ["Partly Cloudy", "🌤️"];
    } else if (code === 3) {
        return ["Cloudy", "☁️"];
    } else if (code >= 45 && code <= 48) {
        return ["Foggy", "🌫️"];
    } else if (code >= 51 && code <= 67) {
        return ["Drizzle / Rain", "🌧️"];
    } else if (code >= 71 && code <= 77) {
        return ["Snow", "❄️"];
    } else if (code >= 80 && code <= 82) {
        return ["Rain Showers", "🌦️"];
    } else if (code >= 95) {
        return ["Thunderstorm", "⛈️"];
    } else {
        return ["Unknown Weather", "🌤️"];
    }
}

const weatherInfo = getWeatherDescription(weatherData.current.weather_code);

document.getElementById("weatherdescription").textContent = weatherInfo[0];
document.getElementById("weathericon").textContent = weatherInfo[1];




