var map, infoWindow;
var lon;
var lat;
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
      console.log(results[0].geometry.location.lng());
      console.log(results[0].geometry.location.lat());
      lon = results[0].geometry.location.lng();
      lat = results[0].geometry.location.lat();
      getLngLat(lat, lon);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function formatQueryParams(params) {
  var qureyItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      return qureyItems.join('&');
}

function getLngLat (querry) {
  var params = {
    key: mountainProjectKey,
    lat: lat,
    lon: lon,
    // maxDistance: querry,
    // maxResults: querry
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
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong ${err.message}`);
    });
};

function getResults () {};

function getMarkers () {};

function displayResults () {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++) {
      $('#results-list').append(
          `<li><a href='${responseJson.data[i].url}'><h3>${responseJson.data[i].fullName}</h3></a>
          <p>${responseJson.data[i].description}</p>
          </li>`
        )};
  $('#search-results').removeClass('hidden');
}