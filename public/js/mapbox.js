
console.log('mapbox');
mapboxgl.accessToken = 'pk.eyJ1IjoibGF2YXBpZXMiLCJhIjoiY2t6bXFmenJvNDZtdTMwbzEyMGtocmFyeSJ9.fZ0tppeLAusfK9l8yfgZFA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // style: 'mapbox://styles/mapbox/streets-v11', // style URL
    style: 'mapbox://styles/lavapies/ckzrhpoud000j14lkj1c7n56n', // style URL
    center: [10.122195755858513, 47.35044], // starting position [lng, lat]
    zoom: 3,
    // language: eng // starting zoom
});

map.addControl(new MapboxGeocoder({
accessToken: mapboxgl.accessToken,

// bbox: [-74.390249, 40.414685, -73.519390, 40.976805] ,
zoom: 5,}));

 const nav = new mapboxgl.NavigationControl();
 map.addControl(nav, 'top-left');

// set a popup
const popup = new mapboxgl.Popup({
    closeButton: true
});

let markers = [];
let coordinates = [];
let marker;
let street;
let city;
let plz;

// popup.setLngLat([13.404954, 52.560090])
// .setHTML('<h5>Hello Mapbox</h5>')
// .addTo(map);

// create a new marker
map.on('click', addMarker);

// exapmle coords for test purposes - TO BE DELETED
const coords = [
    [12.6712, 38.1131],
    [13.9688, 38.0322],
    [12.6737, 37.5611],
];

coords.forEach(coord => {
    addMarkerFromDB(coord)
}); 

 // function to display the existing markers from DB 
function addMarkerFromDB(coord) {
    new mapboxgl.Marker({
    color: '#2abe88',
    draggable: true
}).setLngLat(coord)
.addTo(map)
.on('dragend', event => console.log(event.target._lngLat))
};

// save the position
// axios.post('/location/update', {
//     position: event.target._lngLat
// })


// function to add marker on click
// function addMarker(event) {
//     const coords = event.lngLat;
//     console.log(coords);
//     // set an existing marker on the map
//     new mapboxgl.Marker({
//     color: 'red',
//     draggable: true
// }).setLngLat(coords)
// .addTo(map)
// .on('dragend', event => console.log(event.target._lngLat))
// };


function addMarker(event) {
    coordinates = event.lngLat;

    console.log(coordinates);
    marker = new mapboxgl.Marker({
    color: '#2abe88',
    draggable: true
}).setLngLat(coordinates)
.addTo(map)
.on('dragend', event => console.log(event.target._lngLat));

popup 
    .setLngLat(coordinates)
    .setHTML(
        '<div><button onclick="window.location.replace(`/new/?street=${street}&plz=${plz}&city=${city}`)">Add a Location here ????</button></div>'
    )
    .addTo(map);
console.log(coordinates);
const lat = coordinates.lat;
const long = coordinates.lng;    

// add geocoder
// map.addControl(
//     new MapboxGeocoder({
//         accessToken: mapboxgl.accessToken,
//         // language: 'de-DE',
//         mapboxgl: mapboxgl,
//     })
// );

mapboxClient.geocoding
.reverseGeocode({
    query: [long,lat]
})
.send()
.then(function(response) {
    if (
        response &&
        response.body &&
        response.body.features &&
        response.body.features.length
      ) {
        const fullAddress = response.body.features[0].place_name;
        const splitAddress = fullAddress.split(',');
        const plzCity = splitAddress[1].split(' ');
        street = splitAddress[0];
        plz = plzCity[1];
        city = plzCity[2];
        console.log(street);
    }    
});

    // remove a marker
    marker.getElement().addEventListener('click', () => {
        marker.remove();
    });
};

map.on('click', addMarker);

axios.get('/location/')
  .then(async res => {
    //console.log(res)
    const locations = res.data
    console.log(res.data);
    for (let i = 0; i < locations.length; i++) {
      const coord = [locations[i].latitude, locations[i].longitude]
      await addMarker2(coord)
     }
  })

  function addMarker2 (coord) {
   console.log(coord);
    new mapboxgl.Marker({
        color: "red",
      })
        .setLngLat(coord)
        .addTo(map) 
}