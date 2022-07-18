var displayBannerCounter = 0;
var bannerInterval;

var dataUrl = "./data.json";

var airportObjArr = [];

var dataCards = ["Fuel Types", "Radio Frequencies", "Weather", "Runways"];

fetch(dataUrl).then(response => {
    response.json().then(function(data) {
        populateAirportsArr(data.results);
    });
})
.catch(err => {
    console.log(err);
});

var populateAirportsArr = function (airportsArr) {
    // var airportObjectsArr = [];
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
    displayCharts();
}

var displayWeatherBanner = function () {

    // var spanEl = $("span").addClass("weather-banner");
    var bannerText = "";

    for(var i = 0; i < airportObjArr.length; i++){
        var airportID = airportObjArr[i].identifier;
        var weather = airportObjArr[i].weather.temperature;

        bannerText = bannerText + airportID + '/' + weather + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0';
        
    }
    var pEl = $("<p>").addClass("banner-text").text(bannerText);
    // spanEl.append(pEl);
    $(".weather-banner").append(pEl)
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
    $(".airport-data").empty();

    var airportObject = airportObjArr.find(airport => airport.identifier === id);

    var airportTitleDiv = $("<div>").addClass("airport-title-container");
    var airportTitleEl = $("<h3>").addClass("airport-title").text(airportObject.identifier + ", " + airportObject.name);

    airportTitleDiv.append(airportTitleEl);

    var cardsContainerDiv = $("<div>").addClass("card-container-div");

    var fuelCard = $("<div>").addClass("card");
    var radioCard = $("<div>").addClass("card");
    var weatherCard = $("<div>").addClass("card");
    

    var fuelHeaderEl = $("<div>").addClass("card-header").text("Fuel Available");
    // fuelHeaderEl.innerHTML += '<img src="./assets/css/images/fuel-icon.svg" />';

    var radioHeaderEl = $("<div>").addClass("card-header").text("Radio Frequencies");
    var weatherHeaderEl = $("<div>").addClass("card-header").text("Weather");

    var fuelCardUlEl = $("<ul>").addClass("list-card list-card-flush");
    var radioCardUlEl = $("<ul>").addClass("list-card list-card-flush");
    var weatherCardUlEl = $("<ul>").addClass("list-card list-card-flush");

    for(var i = 0; i < airportObject.fuel.length; i++){
        var cardLiEl = $("<li>").addClass("list-card-item").text(airportObject.fuel[i].type + ": " + airportObject.fuel[i].price);
        fuelCardUlEl.append(cardLiEl);
    }

    // var fuelIconEl = $("img").addClass("card-header").attr("src", "./assets/css/images/fuel-icon.svg");
    // fuelCard.append(fuelIconEl);

    fuelCard.append(fuelHeaderEl);
    fuelCard.append(fuelCardUlEl);

    // radio object
    var radioObject = airportObject.radioFrequencies;
    Object.keys(radioObject).forEach(key => {
        var cardLiEl = $("<li>").addClass("list-card-item").text(key + ": " + radioObject[key]);
        radioCardUlEl.append(cardLiEl);
    });
    
    radioCard.append(radioHeaderEl);
    radioCard.append(radioCardUlEl);

    // weather object
    var weatherObject = airportObject.weather;
    Object.keys(weatherObject).forEach(key => {
        var cardLiEl = $("<li>").addClass("list-card-item").text(key + ": " + weatherObject[key]);
        weatherCardUlEl.append(cardLiEl);
    });

    weatherCard.append(weatherHeaderEl);
    weatherCard.append(weatherCardUlEl);

    cardsContainerDiv.append(fuelCard);
    cardsContainerDiv.append(radioCard);
    cardsContainerDiv.append(weatherCard);

    var pEl = $("<h5>").addClass("runways-section-title").text("Runways:");
    var brEl = $("<br>").addClass("my-break");
    cardsContainerDiv.append(brEl);
    cardsContainerDiv.append(pEl);
    cardsContainerDiv.append(brEl);

    // runways object
    var runwaysArray = airportObject.runways;
    for(var i = 0; i < runwaysArray.length; i++){
        var runwayCard = $("<div>").addClass("card");
        var runwayCardUlEl = $("<ul>").addClass("list-card list-card-flush");

        if(runwaysArray[i].runway_identifier){
            var runwayHeaderEl = $("<div>").addClass("card-header").text("Runway #" + runwaysArray[i].runway_identifier);
        } else {
            var runwayHeaderEl = $("<div>").addClass("card-header").text("Runway #" + runwaysArray[i].runway_number);
        }
        

        Object.keys(runwaysArray[i]).forEach(key => {
            var cardLiEl = $("<li>").addClass("list-card-item").text(key + ": " + runwaysArray[i][key]);
            runwayCardUlEl.append(cardLiEl);
        });
        runwayCard.append(runwayHeaderEl);
        runwayCard.append(runwayCardUlEl);
        cardsContainerDiv.append(runwayCard);   
    }

    
    $(".airport-data").append(airportTitleDiv);
    $(".airport-data").append(cardsContainerDiv);

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

var displayCharts = function() {

    var xValues = [];
    var yJetValues = [];
    var yLlValues = [];

    for(var i = 0; i < airportObjArr.length; i++){
        var airID = airportObjArr[i].identifier;
        var llFuel = airportObjArr[i].fuel[0].price;
        var jetFuel = airportObjArr[i].fuel[1].price;

        var jetFuelPrice = jetFuel.substr(1,4);
        var llFuelPrice = llFuel.substr(1,4);
        
        xValues.push(airID);
        yJetValues.push(jetFuelPrice);
        yLlValues.push(llFuelPrice);
    }

    var jetFuelChartsAreaEl = $("<div>").addClass("charts-area");

    var jetFuelCanvasEl = $("<canvas>").attr("id","jetFuelChart");
    jetFuelChartsAreaEl.append(jetFuelCanvasEl);

    var jetCarouselItemEl = $("<div>").addClass("carousel-item active");
    jetCarouselItemEl.append(jetFuelChartsAreaEl);

    $(".carousel-inner").append(jetCarouselItemEl);

    new Chart("jetFuelChart", {
    type: "bar",
    data: {
        labels: xValues,
        datasets: [{
        backgroundColor: 'darkgreen',
        data: yJetValues,
        label: '$/gal'
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    fontSize: 30
                }
            }],
            xAxes: [{
                ticks: {
                    fontSize: 30
                }
            }]
        },
        title: {
            display: 'true',
            text: 'Jet Fuel Prices',
            fontSize: 50,
            fontColor: 'black'
        },
        legend: {
            display: true,
            labels: {
                fontSize: 30
            }
        }
    }
    });


    var lLFuelChartsAreaEl = $("<div>").addClass("charts-area");

    var lLFuelCanvasEl = $("<canvas>").attr("id","lLFuelChart");
    lLFuelChartsAreaEl.append(lLFuelCanvasEl);

    var lLCarouselItemEl = $("<div>").addClass("carousel-item");
    lLCarouselItemEl.append(lLFuelChartsAreaEl);

    $(".carousel-inner").append(lLCarouselItemEl);

    new Chart("lLFuelChart", {
    type: "bar",
    data: {
        labels: xValues,
        datasets: [{
        backgroundColor: 'green',
        data: yLlValues,
        label: '$/gal'
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    fontSize: 30
                }
            }],
            xAxes: [{
                ticks: {
                    fontSize: 30
                }
            }]
        },
        title: {
            display: 'true',
            text: 'LL Fuel Prices',
            fontSize: 50
        },
        legend: {
            display: true,
            labels: {
                fontSize: 30
            }
        }
    }
    });

}
