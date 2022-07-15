var displayBannerCounter = 0;
var bannerInterval;

// format the github api url 
var dataUrl = "./data.json";

var airportObjArr = [];

fetch(dataUrl).then(response => {
    response.json().then(function(data) {
        populateAirportsArr(data.results);
    });
})
.catch(err => {
    console.log(err);
});

var populateAirportsArr = function (airportsArr) {
    var airportObjectsArr = [];
    console.log(airportsArr);

    for(var i = 0; i < airportsArr.length; i++){
        var airportObj = {
            name : airportsArr[i].name,
            identifier : airportsArr[i].identifier,
            radioFrequencies : airportsArr[i].radio_frequencies,
            fuel : airportsArr[i].fuel,
            weather : airportsArr[i].wheather,
            runways : airportsArr[i].runways
        }
        airportObjArr.push(airportObj);
    }
    displayWeatherBanner();
    displayAirportList();
    // bannerInterval = setInterval(displayWeatherBanner, 1000, airportObjectsArr);
}

var displayWeatherBanner = function () {

    var spanEl = $("span").addClass("weather-banner");
    var bannerText = "";

    for(var i = 0; i < airportObjArr.length; i++){
        var airportID = airportObjArr[i].identifier;
        var weather = airportObjArr[i].weather.temperature;

        bannerText = bannerText + airportID + '/' + weather + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0';
        
    }
    var pEl = $("<p>").addClass("banner-text").text(bannerText);
    spanEl.append(pEl);
    $(".weather-container").append(spanEl)
}

var displayAirportList = function (){

    for(var i = 0; i < airportObjArr.length; i++){
        var airportIDEl = $("<h5>").text(airportObjArr[i].identifier);
        var airportNameEl = $("<h6>").text(airportObjArr[i].name);
        var airportListEl = $("<li>").addClass("list-group-item").attr("id", "airportId-" + airportObjArr[i].identifier);

        airportListEl.append(airportIDEl);
        airportListEl.append(airportNameEl);

        $(".list-group").append(airportListEl);
    }
}

var displayAirportData = function(id){
    $(".intro-text").remove();
    var airportObject = airportObjArr.find(airport => airport.identifier === id);
    
    var airportTitleEl = $("<h3>").addClass("airport-title").text(airportObject.identifier + ", " + airportObject.name);

    $(".airport-data").append(airportTitleEl);
}

$(document).ready(function(){
    $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#airport-list li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });

  $(".list-group").on('click', 'li.list-group-item',function(){
    var airportID = this.id.slice(-4);
    displayAirportData(airportID);
  })

