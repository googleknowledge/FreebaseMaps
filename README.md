#FreebaseMaps

This is a sample app that combines geolocated entities from
[Freebase](http://freebase.com) with
[Google Maps API](https://developers.google.com/maps/).

You can see the deployed version on
[googleknowledge.github.io/FreebaseMaps](http://googleknowledge.github.io/FreebaseMaps).

The app uses browser's geolocation feature to find user's location and displays
a map of interesting objects that can be found nearby (within 50 000 ft).
It uses the Freebase
[Search API](https://developers.google.com/freebase/v1/search-overview) to
find relevant objects.

When user clicks on one of the markers, the app calls the Freebase
[Topic API](https://developers.google.com/freebase/v1/topic-overview)
to fetch more information about that object.
Once the information is retrieved, it populates a
[purejs](http://beebole.com/pure/) template to display a knowledge card
for the user.
