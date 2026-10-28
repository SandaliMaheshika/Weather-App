const cityInput = document.getElementById("cityinput");
const searchBtn = document.getElementById("searchBtn");

// Search button eka click karama
searchBtn.addEventListener("click", function() {
const city = cityInput.value.trim();


if (city === "") {
    alert("Please enter a city name!");
    return;
}

getWeather(city);


});

// Enter key eka press kalath search wenawa
cityInput.addEventListener("keydown", function(event) {
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

    if (!geoData.results || geoData.results.length === 0) {
        alert("City not found! Please try another city.");
        return;
    }

    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;
    const cityName = geoData.results[0].name;
    const country = geoData.results[0].country;

    console.log("City:", cityName, country);
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    alert("City found: " + cityName + ", " + country);

} catch (error) {
    console.log("Error:", error);
    alert("Unable to get city data. Please try again.");
}


}
