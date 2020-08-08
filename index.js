var map, infoWindow;
var lon;
var lat;
var maxResults;
var maxDistance;
let mountainProjectURL = "https://www.mountainproject.com/data/get-routes-for-lat-lon";
let mountainProjectKey = "200793847-4c8ca95c19e7a222488e00479926bf74"

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: -34.397, lng: 150.644 }
  });
  const geocoder = new google.maps.Geocoder();
  document.getElementById("submit").addEventListener("click", () => {
    geocodeAddress(geocoder, map);
  });
}

function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById("address").value;
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      resultsMap.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
      getResults(results);
      getLngLat(lat, lon, maxDistance, maxResults, resultsMap);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function getResults(results) {
  lon = results[0].geometry.location.lng();
  lat = results[0].geometry.location.lat();
  maxResults = $('#js-max-results').val();
  maxDistance = $('#distance').val();
}

function formatQueryParams(params) {
  var qureyItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      return qureyItems.join('&');
}

function getLngLat (querry1, querry2, querry3, limit=50, map) {
  var params = {
    key: mountainProjectKey,
    lat: querry1,
    lon: querry2,
    maxDistance: querry3,
    limit
  };
  var queryString = formatQueryParams(params);
  var url = mountainProjectURL+ '?' + queryString;

  console.log(url);
  fetch(url)
    .then(respone => {
      if(respone.ok) {
        return respone.json();
      }
      throw new Error(respons.statusText);
    })
    .then((responseJson) => {
      setMarkers (map, responseJson);
      displayResults(responseJson);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong ${err.message}`);
    });
};

function setMarkers (map, responseJson) {
  for (let j = 0; j < responseJson.routes.length; j++) {
    var marker = new google.maps.Marker({
      position: { lat: responseJson.routes[j].latitude, lng: responseJson.routes[j].longitude },
      map: map,
      title: responseJson.routes[j].name
    });
  }
  marker.setMap(map);
};

function displayResults (responseJson) {
  $('#search-results').removeClass('hidden');
  $('#results-list').empty();
  for (let i = 0; i < responseJson.routes.length; i++) {
      $('#results-list').append(
          `<li><a href='${responseJson.routes[i].url}'><h3>${responseJson.routes[i].name}</h3></a>
          <ul>Type: ${responseJson.routes[i].type}</ul>
          <ul>Grade: ${responseJson.routes[i].rating}</ul>
          <ul>Stars: ${responseJson.routes[i].stars}</ul>
          <ul>Location: ${responseJson.routes[i].location[1]}</ul>
          </li>`
        )};
}