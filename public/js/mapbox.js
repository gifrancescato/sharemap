console.log('mapbox');
mapboxgl.accessToken = 'pk.eyJ1IjoibGF2YXBpZXMiLCJhIjoiY2t6bXFmenJvNDZtdTMwbzEyMGtocmFyeSJ9.fZ0tppeLAusfK9l8yfgZFA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [13.404954, 52.520008], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

// set a popup
const popup = new mapboxgl.Popup({
    closeButton: true
});

popup.setLngLat([13.404954, 52.560090])
.setHTML('<h5>Hello Mapbox</h5>')
.addTo(map);

// create a new marker
map.on('click', addMarker);

const coords = [
    [13.405, 52.52],
    [13.6, 52.6]
];

coords.forEach(coord => {
    addMarkerFromDB(coord)
}); 

 // function to display the existing markers from DB 
function addMarkerFromDB(coord) {
    new mapboxgl.Marker({
    color: 'red',
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
function addMarker(event) {
    const coords = event.lngLat;
    console.log(coords);
    // set an existing marker on the map
    new mapboxgl.Marker({
    color: 'red',
    draggable: true
}).setLngLat(coords)
.addTo(map)
.on('dragend', event => console.log(event.target._lngLat))
};



