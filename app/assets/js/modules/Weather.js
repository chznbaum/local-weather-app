import $ from 'jquery';

class Weather {
  constructor() {
    this.checkBrowser();
  }

  checkBrowser() {
    const that = this;
    if (navigator && navigator.geolocation) {
      this.geolocate();
    } else {
      that.iplocate(that);
    }
  }

  geolocate() {
    const that = this;
    const options = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
    }
    function success(position) {
      const coordinates = {
        latitude: position.coords.latitude, longitude: position.coords.longitude
      };
      this.geocode(coordinates);
      this.weatherLookup(coordinates);
    }
    function error(error) {
      that.iplocate(that);
    }
    navigator.geolocation.getCurrentPosition(success.bind(this), error(), options);
  }

  iplocate(that) {
    const iplocateUrl = 'https://ipapi.co/json/';
    $.getJSON(iplocateUrl, function(data) {
      const coordinates = {
        latitude: data.latitude,
        longitude: data.longitude
      }
      that.geocode(coordinates);
      that.weatherLookup(coordinates);
    });
  }

  geocode(coordinates) {
    const locationPlace = $('.locationDescription');
    const geocodeApi = 'AIzaSyDC6U1aZXcePTAR20iwRKIuJ26LqXX6t5s';
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${geocodeApi}`;
    let formattedLocation = '';
    $.getJSON(geocodeUrl, function(data) {
      locationPlace.html(data.results[2].formatted_address);
    });
  }

  weatherLookup(coordinates) {
    const that = this;
    const weatherApi = '56e678830a6e621a5f38e1b43296e432';
    const weatherUrl = `https://api.darksky.net/forecast/${weatherApi}/${coordinates.latitude},${coordinates.longitude}?callback=?`;
    $.getJSON(weatherUrl, function(data) {
      that.printWeather(data);
    });
  }

  printWeather(data) {
    const printPlaces = {
      current: {
        icon: $('.current-icon'),
        unit: [
          $('.current-temperature-unit'),
          $('.current-low-unit'),
          $('.current-high-unit'),
          $('.current-feels-like-unit')
        ],
        temperature: $('.current-temperature-number'),
        low: $('.current-low-number'),
        high: $('.current-high-number'),
        feelsLike: $('.current-feels-like-number'),
        description: $('.current-description')
      },
      forecast: {
        summary: '.forecast-summary',
        date: '.date-',
        icon: '.forecast-icon-',
        unit: [
          '.forecast-low-unit-',
          '.forecast-high-unit-'
        ],
        low: '.forecast-low-number-',
        high: '.forecast-high-number-',
        description: '.forecast-description-'
      }
    }

    function printCurrent() {
      printPlaces.current.unit.forEach(function(element) {
        element.html('°F');
      });
      printPlaces.current.icon.addClass(`icon--${data.currently.icon}`);
      printPlaces.current.temperature.html(data.currently.temperature);
      printPlaces.current.low.html(data.daily.data[0].temperatureLow);
      printPlaces.current.high.html(data.daily.data[0].temperatureHigh);
      printPlaces.current.feelsLike.html(data.currently.apparentTemperature);
      printPlaces.current.description.html(`${data.currently.summary}`);
      if (data.currently.nearestStormDistance > 0) {
        let nearestStormDirection;
        switch (true) {
          case data.currently.nearestStormBearing > 337 || data.currently.nearestStormBearing < 23 : // North
            nearestStormDirection = 'north';
            break;
          case data.currently.nearestStormBearing > 22 && data.currently.nearestStormBearing < 68 : // Northeeast
            nearestStormDirection = 'northeast';
            break;
          case data.currently.nearestStormBearing > 67 && data.currently.nearestStormBearing < 113 : // East
            nearestStormDirection = 'east';
            break;
          case data.currently.nearestStormBearing > 112 && data.currently.nearestStormBearing < 158 : // Southeast
            nearestStormDirection = 'southeast';
            break;
          case data.currently.nearestStormBearing > 157 && data.currently.nearestStormBearing < 203 : // South
            nearestStormDirection = 'south';
            break;
          case data.currently.nearestStormBearing > 202 && data.currently.nearestStormBearing < 248 : // Southwest
            nearestStormDirection = 'southwest';
            break;
          case data.currently.nearestStormBearing > 247 && data.currently.nearestStormBearing < 293 : // West
            nearestStormDirection = 'west';
            break;
          case data.currently.nearestStormBearing > 292 && data.currently.nearestStormBearing < 338 : // Northwest
            nearestStormDirection = 'northwest';
            break;
        }
        printPlaces.current.description.append(`. Nearest storm is ${data.currently.nearestStormDistance} mi to the ${nearestStormDirection}.`);
      }
    }

    function printForecast() {
      const forecastSummary = $(`${printPlaces.forecast.summary}`);
      forecastSummary.html(data.daily.summary);
      let day;
      for (day = 1; day < 8; day++) {
        const forecastDate = $(`${printPlaces.forecast.date}${day}`);
        const forecastIcon = $(`${printPlaces.forecast.icon}${day}`);
        const forecastUnit = [
          $(`${printPlaces.forecast.unit[0]}${day}`),
          $(`${printPlaces.forecast.unit[1]}${day}`)
        ];
        const forecastLow = $(`${printPlaces.forecast.low}${day}`);
        const forecastHigh = $(`${printPlaces.forecast.high}${day}`);
        const forecastDescription = $(`${printPlaces.forecast.description}${day}`);
        const date = data.daily.data[day].time;
        const formattedDate = new Date(date * 1000).toDateString();
        forecastDate.html(formattedDate);
        forecastIcon.addClass(`icon--${data.daily.data[day].icon}`);
        forecastUnit.forEach(function(element) {
          element.html('°F');
        });
        forecastLow.html(data.daily.data[day].temperatureLow);
        forecastHigh.html(data.daily.data[day].temperatureHigh);
        forecastDescription.html(`${data.daily.data[day].summary}`);
      }
    }

    printCurrent();
    printForecast();
  }
}

export default Weather;