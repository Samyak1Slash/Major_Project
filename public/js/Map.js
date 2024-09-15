//As you can see here is lots of error coz we cant access .env tokens to js only ejs so what will we do is send a script
//(whivh contain env varibles) from ejs to thisjs and use the varible

// Set the Mapbox access token (passed from EJS)
mapboxgl.accessToken = mapToken;

// Create a new Mapbox map instance
const map = new mapboxgl.Map({
    container: 'map', // ID of the container where the map will be rendered
    style: 'mapbox://styles/mapbox/dark-v11', // Map style
    center: listing.geometry.coordinates, // Starting position [lng, lat]
    zoom: 9 // Initial zoom level
});

// Add a marker at the listing coordinates
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates) // Coordinates of the listing
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // Add a popup on click
    .setHTML(`<h5>${listing.location}</h5><p>Exact Location will be provided after booking.</p>`)) 
    .addTo(map); // Add marker to the map
