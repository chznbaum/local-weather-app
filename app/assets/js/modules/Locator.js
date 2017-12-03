class Locator {
  constructor() {

  }

  checkBrowser() {
    if (!navigator.geolocation) {
      // Browser doesn't support geolocation
      console.log('No geolocation support');
    } else {
      geolocate();
    }
  }

  geolocate() {
    console.log(this);
  }
}

export default Locator;