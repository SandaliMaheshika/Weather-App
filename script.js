const cityinput = document.getElementById("cityinput");
const searchBtn = document.getElementById("searchBtn");

let rainChart = null;


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



// Create Weather Map
const map = L.map("weatherMap").setView([7.8731, 80.7718], 7);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
let weatherMarker = null;


// Update Weather Map
function updateWeatherMap(latitude, longitude, cityName, temperature, icon, description) {

    if (weatherMarker !== null) {
        map.removeLayer(weatherMarker);
    }

    map.setView([latitude, longitude], 8);

    weatherMarker = L.marker([latitude, longitude]).addTo(map);

    weatherMarker.bindPopup(
        "<h3>" + cityName + "</h3>" +
        "<h2>" + icon + " " + temperature + "°C</h2>" +
        "<p>" + description + "</p>"
    );
}

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

        document.getElementById("weathericon").textContent = weatherInfo[1];

        // Update Weather Map
        updateWeatherMap(
            latitude,
            longitude,
            cityName,
            weatherData.current.temperature_2m,
            weatherInfo[1],
            weatherInfo[0]
        );

        //7 days forcast display
        const forcast = document.getElementById("forcastdetails");

        forcast.innerHTML = "";

        for (let i = 0; i < weatherData.daily.time.length; i++) {

            const date = new Date(weatherData.daily.time[i] + "T12:00:00");
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

            const maxTemp = weatherData.daily.temperature_2m_max[i];
            const minTemp = weatherData.daily.temperature_2m_min[i];

            const dayInfo = getWeatherDescription(weatherData.daily.weather_code[i]);
            const dayElement = document.createElement("div");

            dayElement.innerHTML =
                "<p>" + dayName + " " + dayInfo[1] + "</p>" +
                "<p>" + Math.round(maxTemp) + "° / " +
                Math.round(minTemp) + "°C</p>";

            forcast.appendChild(dayElement);

        }

        function updateRainChart(dailyData) {

            const labels = dailyData.time.map(function (date) {
                return date.substring(5);
            });

            const values = dailyData.precipitation_probability_max;

            const ctx = document.getElementById("rainChartCanvas");

            if (rainChart !== null) { rainChart.destroy(); }

            rainChart = new Chart(ctx, {
                type: "bar",

                data: {
                    labels: labels,

                    datasets: [{
                        label: "Chance of Rain (%)",
                        data: values,
                        backgroundColor: "#38bdf8",
                        borderRadius: 8
                    }]
                },

                options: {
                    responsive: true,

                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,

                            ticks: {
                                callback: function (value) {
                                    return value + "%";
                                }
                            }
                        }
                    }
                }
            });
        }

        updateRainChart(weatherData.daily);

    } catch (error) {
        console.log("Error:", error);

    }




}

