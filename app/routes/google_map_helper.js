
const util = require('util')

const googleMapsClient = require('@google/maps').createClient({
	  key: 'AIzaSyCr9MZPxhv_sqvd3E53DqUaJvo9t8yBLRQ',
    Promise: Promise
});


//let currentBusGPSLocation = {lat:22.357647, lng:114.1277058};

// const getInfo = async () => {
//  console.log(await axios.get('/users'))
//  console.log(await getGroups())
//  console.log(await getFavorites())
//  return 'all done';
// }
var request_arrival_time =  function (busStops) {
	//
  // let busRoutes = [
  // 	{
  //       "road_name_en" : "Start",
  //       "road_name_tc" : "Start",
  //       "stops" : [
  //           {
  //               "stop_name_en" : "MTR Kwai Fong Station, Hing Ning Rd",
  //               "stop_name_tc" : "興寧路，港鐵葵芳站",
  //               "stop_nickname_en" : "",
  //               "stop_nickname_tc" : "",
  //               "latlng" : {
  //                   "lat" : 22.357647,
  //                   "lng" : 114.1277058
  //               }
  //           }
  //       ]
  //   },
  //   {
  //       "road_name_en" : "Kwai Yan Rd",
  //       "road_name_tc" : "",
  //       "stops" : []
  //   },
  //   {
  //       "road_name_en" : "Kwai Yi Rd",
  //       "road_name_tc" : "",
  //       "stops" : []
  //   },
  //   {
  //       "road_name_en" : "Kwai Foo Rd",
  //       "road_name_tc" : "",
  //       "stops" : [
  //           {
  //               "stop_name_en" : "Ho Chuck Centre",
  //               "stop_name_tc" : "",
  //               "stop_nickname_en" : "New Kwai Fong Gardens",
  //               "stop_nickname_tc" : "",
  //               "latlng" : {
  //                   "lat" : 22.3576437,
  //                   "lng" : 114.1287348
  //               }
  //           }
  //       ]
  //   }];

	//let busStops = [];
	// busRoutes.forEach(function(busRoute) {
	// 	busRoute.stops.forEach(function(stop) {
	// 		busStops.push(stop);
	// 	});
	// });

  let paramToGoogleMaps = {
  	origin:busStops[0].latlng,
  	destination: busStops[busStops.length - 1].latlng,
  	waypoints: [],
  }


  busStops.forEach(function(stop) {
  	paramToGoogleMaps.waypoints.push(stop.latlng);
  })


  // Get Direction for an address.
  let durationArray = [];


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
    return;

  googleMapsClient.directions(paramToGoogleMaps, function(err, response) {
  	if (!err) {
  		//console.log('The resonse', util.inspect(response.json.routes[0].legs, {showHidden: false, depth: null}));

  		response.json.routes[0].legs.forEach(function(element) {
  			durationArray.push(element.duration);
  		});

  		 busStops.forEach(function (element, i) {
  		 	busStops[i].duration_sec = durationArray[i].value;
  		 	busStops[i].duration_text = durationArray[i].text;
  		 })

       res.body(busStops);
       res.send(JSON.stringify(busStops));
   		 //console.log('busStops', busStops);
       //return busStops;
  		 // console.log('busStops.length', busStops.length);
  		 // console.log('durationArray.length', durationArray.length);
  	} else {
  		console.log('ERROR', err);
  	}
  });
  //return a;
}

module.exports = {
  request_arrival_time
}
