//As you can see here is lots of error coz we cant access .env yokens to js only ejs so what will we do is send a script
//(whivh contain env varibles) from ejs to thisjs and use the varible


    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style:"mapbox://style/mapbox/dark-v11",//Style
        center:listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    // console.log(coordinates);

    const marker1 = new mapboxgl.Marker({color:"Red"})
    .setLngLat(listing.geometry.coordinates) //Listing.f=geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h5>${listing.location}</h5><p>Exact Location will be Provided after booking</p>`))
    .addTo(map);  