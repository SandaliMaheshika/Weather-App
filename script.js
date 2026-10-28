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


// Enter key eka press kalath search wenawa
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

        console.log("City:", cityName, country);
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

    } catch (error) {
      
    }

}