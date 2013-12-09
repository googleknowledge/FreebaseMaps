/**
 * @fileoverview The interactive app UI.
 */


/**
 * Initializes the UI.
 */
fbmap.initialize = function() {
  $('.card').hide();
  var onGeolocSuccess = function(position) {
    fbmap.initMap(position.coords.latitude, position.coords.longitude);
  };

  var onGeolocError = function() {
    var contentString = 'Error: The Geolocation service failed or your ' +
      'browser doesn\'t support geolocation.';
    fbmap.setFlash(contentString, 'error');
    var lat = 37.75;  // Default: San Francisco.
    var lng = -122.5;  // Default: San Francisco.
    fbmap.initMap(lat, lng);
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onGeolocSuccess, onGeolocError);
  } else {
    onGeolocError();
  }
};

google.maps.event.addDomListener(window, 'load', fbmap.initialize);
