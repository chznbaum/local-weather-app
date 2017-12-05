import $ from 'jquery';
import moment from 'moment';
import { fail } from 'assert';

class Weather {
  constructor() {
    this.fahrenheit = true;
    this.fahrenheitButton = $('.button--fahrenheit');
    this.celsiusButton = $('.button--celsius');
    this.conversionList = $('.to-convert');
    this.events();
    this.checkBrowser();
  }

  events() {
    this.fahrenheitButton.click(this.toFahrenheit.bind(this));
    this.celsiusButton.click(this.toCelsius.bind(this));
  }

  checkBrowser() {
    const that = this;
    if (navigator && navigator.geolocation) {
      this.geolocate();
    } else {
      // Fall back to IP location
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
      console.log(error);
      // Fall back to IP location
      that.iplocate(that);
    }
    navigator.geolocation.getCurrentPosition(success.bind(this), error, options);
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
      unit: $('.unit'),
      current: {
        icon: $('.current-icon'),
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
        low: '.forecast-low-number-',
        high: '.forecast-high-number-',
        description: '.forecast-description-'
      }
    }

    function printCurrent() {
      printPlaces.current.icon.addClass(`icon--${data.currently.icon}`);
      printPlaces.current.temperature.html(
        `${parseInt(data.currently.temperature)}°`
        );
      printPlaces.current.low.html(
        `${parseInt(data.daily.data[0].temperatureLow)}°`
      );
      printPlaces.current.high.html(
        `${parseInt(data.daily.data[0].temperatureHigh)}°`
      );
      printPlaces.current.feelsLike.html(
        `${parseInt(data.currently.apparentTemperature)}°`
      );
      printPlaces.current.description.html(`${data.currently.summary}`);
      if (data.currently.nearestStormDistance > 0) {
        let nearestStormDirection;
        switch (true) {
          case data.currently.nearestStormBearing > 337 || data.currently.nearestStormBearing < 23 :
            nearestStormDirection = 'north';
            break;
          case data.currently.nearestStormBearing > 22 && data.currently.nearestStormBearing < 68 :
            nearestStormDirection = 'northeast';
            break;
          case data.currently.nearestStormBearing > 67 && data.currently.nearestStormBearing < 113 :
            nearestStormDirection = 'east';
            break;
          case data.currently.nearestStormBearing > 112 && data.currently.nearestStormBearing < 158 :
            nearestStormDirection = 'southeast';
            break;
          case data.currently.nearestStormBearing > 157 && data.currently.nearestStormBearing < 203 :
            nearestStormDirection = 'south';
            break;
          case data.currently.nearestStormBearing > 202 && data.currently.nearestStormBearing < 248 :
            nearestStormDirection = 'southwest';
            break;
          case data.currently.nearestStormBearing > 247 && data.currently.nearestStormBearing < 293 :
            nearestStormDirection = 'west';
            break;
          case data.currently.nearestStormBearing > 292 && data.currently.nearestStormBearing < 338 :
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
        const forecastLow = $(`${printPlaces.forecast.low}${day}`);
        const forecastHigh = $(`${printPlaces.forecast.high}${day}`);
        const forecastDescription = $(`${printPlaces.forecast.description}${day}`);
        const date = new Date(data.daily.data[day].time * 1000);
        const formattedDate = moment(date).format('dddd');
        forecastDate.html(formattedDate);
        forecastIcon.addClass(
          `icon--${data.daily.data[day].icon}`
        );
        forecastLow.html(
          `${parseInt(data.daily.data[day].temperatureLow)}°`
        );
        forecastHigh.html(
          `${parseInt(data.daily.data[day].temperatureHigh)}°`
        );
        forecastDescription.html(`${data.daily.data[day].summary}`);
      }
    }

    function dismissModal() {
      const modal = $('.modal');
      modal.addClass('modal--dismissed');
    }

    printCurrent();
    printForecast();
    dismissModal();
  }

  toFahrenheit() {
    const that = this;
    if (this.fahrenheit == true) {
      return;
    } else {
      $.each(this.conversionList, function(conversionItemNumber, conversionItem) {
        const tempFahrenheit = conversionItem.fahrenheitValue;
        conversionItem.textContent = `${tempFahrenheit}°`;
      });
      this.celsiusButton.removeClass('button--accent-light');
      this.fahrenheitButton.addClass('button--accent-light');
      this.fahrenheit = true;
    }
  }

  toCelsius() {
    const that = this;
    if (this.fahrenheit == false) {
      return;
    } else {
      $.each(this.conversionList, function(conversionItemNumber, conversionItem) {
        const tempFahrenheit = parseInt(conversionItem.innerHTML, 10);
        const tempCelsius = parseInt((tempFahrenheit - 32) * (5 / 9));
        conversionItem.textContent = `${tempCelsius}°`;
        conversionItem.fahrenheitValue = tempFahrenheit;
      });
      this.fahrenheitButton.removeClass('button--accent-light');
      this.celsiusButton.addClass('button--accent-light');
      this.fahrenheit = false;
    }
  }
}

export default Weather;