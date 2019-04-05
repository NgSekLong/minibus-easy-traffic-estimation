const util = require('util')

const googleMapsClient = require('@google/maps').createClient({
	  key: 'AIzaSyCr9MZPxhv_sqvd3E53DqUaJvo9t8yBLRQ'
});




// Geocode an address.
// googleMapsClient.geocode({
// 	address: '1600 Amphitheatre Parkway, Mountain View, CA'
// }, function(err, response) {
// 	if (!err) {
// 		console.log(response.json.results);
// 	}
// });


let currentBusGPSLocation = {lat:22.357647, lng:114.1277058};



let busRoutes = [
	{
      "road_name_en" : "Start",
      "road_name_tc" : "Start",
      "stops" : [
          {
              "stop_name_en" : "MTR Kwai Fong Station, Hing Ning Rd",
              "stop_name_tc" : "興寧路，港鐵葵芳站",
              "stop_nickname_en" : "",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.357647,
                  "lng" : 114.1277058
              }
          }
      ]
  },
  {
      "road_name_en" : "Kwai Yan Rd",
      "road_name_tc" : "",
      "stops" : []
  },
  {
      "road_name_en" : "Kwai Yi Rd",
      "road_name_tc" : "",
      "stops" : []
  },
  {
      "road_name_en" : "Kwai Foo Rd",
      "road_name_tc" : "",
      "stops" : [
          {
              "stop_name_en" : "Ho Chuck Centre",
              "stop_name_tc" : "",
              "stop_nickname_en" : "New Kwai Fong Gardens",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.3576437,
                  "lng" : 114.1287348
              }
          }
      ]
  },
  {
      "road_name_en" : "Hing Fong Rd",
      "road_name_tc" : "",
      "stops" : [
          {
              "stop_name_en" : "Che Fong St",
              "stop_name_tc" : "",
              "stop_nickname_en" : "",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.359368,
                  "lng" : 114.127876
              }
          },
          {
              "stop_name_en" : "Osman Ramju Sadick Memorial Sports Centre",
              "stop_name_tc" : "",
              "stop_nickname_en" : "Kwai Fong Est",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.3608981,
                  "lng" : 114.1294965
              }
          }
      ]
  },
  {
      "road_name_en" : "Tai Wo Hau Rd",
      "road_name_tc" : "",
      "stops" : [
          {
              "stop_name_en" : "Kwai Hong Court",
              "stop_name_tc" : "",
              "stop_nickname_en" : "Sun Kwai Hing Gardens",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.3629193,
                  "lng" : 114.1305255
              }
          }
      ]
  },
  {
      "road_name_en" : "Kwai Shing Circuit",
      "road_name_tc" : "",
      "stops" : [
          {
              "stop_name_en" : "Fung Yat Social Service Complex",
              "stop_name_tc" : "",
              "stop_nickname_en" : "",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.3637385,
                  "lng" : 114.1303102
              }
          },
          {
              "stop_name_en" : "Shing Lok Hse Kwai Shing E Est",
              "stop_name_tc" : "",
              "stop_nickname_en" : "",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.362437,
                  "lng" : 114.127943
              }
          },
          {
              "stop_name_en" : "Kwai Luen Est Phase 2",
              "stop_name_tc" : "",
              "stop_nickname_en" : "",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.3620612,
                  "lng" : 114.1268999
              }
          },
          {
              "stop_name_en" : "Kwai Shing Playground",
              "stop_name_tc" : "",
              "stop_nickname_en" : "",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.3612965,
                  "lng" : 114.1255639
              }
          },
          {
              "stop_name_en" : "S Kwai Chung Jockey Club Polyclinic",
              "stop_name_tc" : "",
              "stop_nickname_en" : "",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.3608519,
                  "lng" : 114.1248564
              }
          },
          {
              "stop_name_en" : "Blk 10 Kwai Shing W Est",
              "stop_name_tc" : "",
              "stop_nickname_en" : "",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.359621,
                  "lng" : 114.122618
              }
          }
      ]
  },
  {
      "road_name_en" : "Shing Fuk St",
      "road_name_tc" : "",
      "stops" : []
  },
  {
      "road_name_en" : "Kwai Fuk Rd",
      "road_name_tc" : "",
      "stops" : [
          {
              "stop_name_en" : "Chun Shing Factory Est",
              "stop_name_tc" : "",
              "stop_nickname_en" : "",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.3609265,
                  "lng" : 114.1202198
              }
          }
      ]
  },
  {
      "road_name_en" : "Yeung Uk Rd",
      "road_name_tc" : "",
      "stops" : [
          {
              "stop_name_en" : "Indi Home",
              "stop_name_tc" : "",
              "stop_nickname_en" : "Chelsea Court",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.3665401,
                  "lng" : 114.1182871
              }
          },
          {
              "stop_name_en" : "Chung On St",
              "stop_name_tc" : "",
              "stop_nickname_en" : "",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.3677141,
                  "lng" : 114.1156692
              }
          },
          {
              "stop_name_en" : "Yeung Uk Rd Market",
              "stop_name_tc" : "",
              "stop_nickname_en" : "",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.36833,
                  "lng" : 114.1145249
              }
          }
      ]
  },
  {
      "road_name_en" : "Tai Ho Rd",
      "road_name_tc" : "",
      "stops" : []
  },
  {
      "road_name_en" : "Hoi Kwai Rd",
      "road_name_tc" : "",
      "stops" : []
  },
  {
      "road_name_en" : "Start",
      "road_name_tc" : "Start",
      "stops" : [
          {
              "stop_name_en" : "Hoi Kwai Rd PTI",
              "stop_name_tc" : "",
              "stop_nickname_en" : "Parc City/ MTR Tsuen Wan West Station",
              "stop_nickname_tc" : "",
              "latlng" : {
                  "lat" : 22.368775,
                  "lng" : 114.1122112
              }
          }
      ]
  }];

	let busStops = [];
	busRoutes.forEach(function(busRoute) {
		busRoute.stops.forEach(function(stop) {
			busStops.push(stop);
		});
	});

	console.log(busStops);



//  busStops = [
// 	{
// 		id: 123,
// 		name: 'Shum Shui Po Stop',
// 		latlng: {lat:35.804953, lng:51.434145},
// 	},
// 	{
// 		id: 123,
// 		name: 'Shum Shui Po Stop',
// 		latlng: {lat:35.804953, lng:51.444045},
// 	},
// ];

let paramToGoogleMaps = {
	origins:[currentBusGPSLocation],
	destinations: [],
}


////////////////////Temp generate Latlng /////////////
// var getRandomInRange = function(from, to, fixed) {
//     return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
//     // .toFixed() returns string, so ' * 1' is a trick to convert to number
// }
// for(let i = 0; i < 100; i++){
// 		paramToGoogleMaps.destinations.push({
// 			lat:getRandomInRange(-180, 180, 3),
// 			lng:getRandomInRange(-180, 180, 3)
// 		})
// }
////////////////////Temp generate Latlng end /////////////


busStops.forEach(function(stop) {
	paramToGoogleMaps.destinations.push(stop.latlng)
})
//console.log('paramToGoogleMaps' ,paramToGoogleMaps);
//return;

//console.log(paramToGoogleMaps);

//return;


// Get Direction for an address.
let durationArray = [];
googleMapsClient.distanceMatrix(paramToGoogleMaps, function(err, response) {
	if (!err) {
		console.log('The resonse', response);

		response.json.rows[0].elements.forEach(function(element) {
			durationArray.push(element.duration);
			//console.log(util.inspect(element, {showHidden: false, depth: null}));
		});
		console.log('durationArray', durationArray);
	} else {
		console.log('ERROR', err);
	}
});


// // Get Direction for an address.
// let durationArray = [];
// googleMapsClient.distanceMatrix(paramToGoogleMaps, function(err, response) {
// 	if (!err) {
// 		console.log('The resonse', response);
//
// 		response.json.rows[0].elements.forEach(function(element) {
// 			durationArray.push(element.duration);
// 			//console.log(util.inspect(element, {showHidden: false, depth: null}));
// 		});
// 		console.log('durationArray', durationArray);
// 	} else {
// 		console.log('ERROR', err);
// 	}
// });
