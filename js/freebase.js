/**
 * @fileoverview Example maps app, allowing the user to view data from Freebase.
 */


/**
 * Namespace.
 */
var fbmap = {
  map: null,
  currentLatLng: null,
  markers: [], //Keep track of currently displayed markers.
  searchUrl: 'https://www.googleapis.com/freebase/v1/search',
  topicUrl: 'https://www.googleapis.com/freebase/v1/topic/',
  category: '/symbols/namesake',
  locString: '/location/location/geolocation'
};


/**
 * Sets a flash message for the user.
 * @param {string} msg The content of the message.
 * @param {string=} opt_type The optional type of the message: error or info.
 */
fbmap.setFlash = function(msg, opt_type) {
  var type = opt_type || 'info';
  $('#flash').addClass(type).text(msg);
};


/**
 * Initializes the map, sets up base click listeners.
 * @param {number} lat Latitude for the map center.
 * @param {number} lng Longitude for the map center.
 */
fbmap.initMap = function(lat, lng) {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(lat, lng),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  fbmap.currentLatLng = mapOptions.center;

  fbmap.map = new google.maps.Map($('#map-canvas')[0], mapOptions);
  // Query for new features on a click.  TODO(jlivni): Maybe query on a pan.
  google.maps.event.addListener(fbmap.map, 'click', function(e) {
    fbmap.currentLatLng = e.latLng;
    fbmap.getFreebaseLocations();
  });

  // Listen for changes on which category to query.  TODO(jlivni): Consider
  // multiple categories.
  $('#category').change(function() {
    $('.card').hide();
    fbmap.category = $(this).val();
    fbmap.getFreebaseLocations();
  });

  // Put the dropdown on the map div.
  var categoryEl = $('#category')[0];
  fbmap.map.controls[google.maps.ControlPosition.TOP_LEFT].push(categoryEl);

  fbmap.getFreebaseLocations();
};


/**
 * Sprite locations used to render map markets for categories.
 * @type {Object.<google.maps.Point>}
 * @const
 */
fbmap.allCategories = [
  '/symbols/namesake',
  '/film/film_location',
  '/visual_art/artwork',
  '/architecture/structure',
  '/travel/tourist_attraction',
  '/sports/sports_facility'
];


/**
 * Queries for new freebase locations.
 */
fbmap.getFreebaseLocations = function() {
  var latLng = fbmap.currentLatLng;
  fbmap.clearMap();
  var categories = fbmap.category == 'all' ?
      fbmap.allCategories : [fbmap.category];
  for (var i = 0, category; category = categories[i]; i++) {
    // Create the Freebase API query.
    var loc = ' lon:' + latLng.lng() + ' lat:' + latLng.lat();
    loc = '(all type:' + category + ' (within radius:50000ft' +
        loc + '))';
    var params = {
      filter: loc,
      output: '(' + fbmap.locString + ')'
    };
    // This wrapper function allows to pass additional argument, 'category'.
    var createMarkers = function(category) {
      return function(response) {
        if (!response.result) {
          fbmap.setFlash('No results found for this area.', 'error');
        }
        var bounds = new google.maps.LatLngBounds();
        $.each(response.result, function(i, result) {
          var loc = result.output[fbmap.locString][fbmap.locString][0];
          var latLng = new google.maps.LatLng(loc.latitude, loc.longitude);
          // TODO(jivni): Use custom icons depending on the category.
          var icon = new google.maps.MarkerImage(
            'images/maki-sprite.png',
            new google.maps.Size(24, 24),
            fbmap.iconAnchorPoints[category]);
          var marker = new google.maps.Marker({
            position: latLng,
            map: fbmap.map,
            title: result.name,
            icon: icon
          });
          fbmap.markers.push(marker);
          // Keep track of the bounding box of all results.
          bounds.extend(latLng);
          google.maps.event.addListener(marker, 'click', function() {
            if (!cards.isCardDisplayed(result.mid)) {
              var params = {
                filter: 'allproperties'
              };
              $.getJSON(fbmap.topicUrl + result.mid, cards.displayCard);
            }
          });
        });
        if (response.result.length > 1) {
          fbmap.map.fitBounds(bounds);
        }
      };
    };
    $.getJSON(fbmap.searchUrl, params, createMarkers(category));
  }
};


/**
 * Clears the map of all markers and cards.
 */
fbmap.clearMap = function() {
  // Loop through all currently displayed markers and remove from map.
  $.each(fbmap.markers, function(i, marker) {
    marker.setMap(null);
  });
  fbmap.markers = [];
  $('.card').hide();
};


/**
 * Sprite locations used to render map markets for categories.
 * @type {Object.<google.maps.Point>}
 * @const
 */
fbmap.iconAnchorPoints = {
  '/symbols/namesake': new google.maps.Point(108, 240),
  '/film/film_location': new google.maps.Point(108, 312),
  '/visual_art/artwork': new google.maps.Point(216, 168),
  '/architecture/structure' : new google.maps.Point(216, 144),
  '/travel/tourist_attraction': new google.maps.Point(54, 504),
  '/sports/sports_facility': new google.maps.Point(162, 192)
};
