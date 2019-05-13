
const util = require('util')

const googleMapsClient = require('@google/maps').createClient({
	  key: 'AIzaSyCr9MZPxhv_sqvd3E53DqUaJvo9t8yBLRQ',
    Promise: Promise
});


var request_arrival_time =  function (busStops) {
  let paramToGoogleMaps = {
  	origin:busStops[0].latlng,
  	destination: busStops[busStops.length - 1].latlng,
  	waypoints: [],
  }


  busStops.forEach(function(stop) {
  	paramToGoogleMaps.waypoints.push(stop.latlng);
  })


  // Get Direction for an address.
	let allGoogleTrafficPromises = [];
	let GOOGLE_DIRECTION_MAX_LENGTH = 23;


	for(let i = 0; i < paramToGoogleMaps.waypoints.length; i += GOOGLE_DIRECTION_MAX_LENGTH){
		let partialWaypoints = paramToGoogleMaps.waypoints.slice(i, i + GOOGLE_DIRECTION_MAX_LENGTH);

		// console.log('partialWaypoints', partialWaypoints);

	  let partialParamToGoogleMaps = {
	  	origin:partialWaypoints[0],
	  	destination: partialWaypoints[partialWaypoints.length - 1],
	  	waypoints: partialWaypoints,
	  }

		var promise = googleMapsClient.directions(partialParamToGoogleMaps)
	    .asPromise()
	    .then((response) => {
		  	let durationArray = [];

				response.json.routes[0].legs.forEach(function(element) {
					durationArray.push(element.duration);
				});

				return durationArray;
	    })
	    .catch((err) => {
	      console.log(err);
	    })
		allGoogleTrafficPromises.push(promise);
	}

	//Resolve all promises
	let allDurationArray = [];
	return Promise.all(allGoogleTrafficPromises).then(function(durationArray) {
		// console.log('busStops', busStops);
		allDurationArray = [].concat.apply([], durationArray);


		busStops.forEach(function (element, j) {
			busStops[j].duration_sec = allDurationArray[j].value;
			busStops[j].duration_text = allDurationArray[j].text;
		})

		return busStops;
	});


}

function processGoogleAPI(paramToGoogleMaps, index) {
	return googleMapsClient.directions(paramToGoogleMaps)
    .asPromise()
    .then((response) => {

  		response.json.routes[0].legs.forEach(function(element) {
  			durationArray.push(element.duration);
  		});

  		 busStops.forEach(function (element, i) {
  		 	busStops[i].duration_sec = durationArray[i].value;
  		 	busStops[i].duration_text = durationArray[i].text;
  		 })
       return busStops;
    })
    .catch((err) => {
      console.log(err);
    });

}

module.exports = {
  request_arrival_time
}
