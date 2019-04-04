const googleMapsClient = require('@google/maps').createClient({
	  key: 'AIzaSyCr9MZPxhv_sqvd3E53DqUaJvo9t8yBLRQ'
});




// Geocode an address.
googleMapsClient.geocode({
	address: '1600 Amphitheatre Parkway, Mountain View, CA' 
}, function(err, response) {
	if (!err) {
		console.log(response.json.results);
	}
});




