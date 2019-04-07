
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
var request_arrival_time =  function (direction) {
	let busRoutes;
	if(direction === 'forward'){
	   busRoutes = [
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
	} else if (direction === 'backward') {
		busRoutes = [
			{
					"stops" : [
							{
									"stop_name_en" : "Hoi Kwai Rd PTI [Parc City/ MTR Tsuen Wan West Station]",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" : 22.368298,
											"lng" : 114.112149
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "Yeung Uk Rd Market [Vision City]",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.368655,
											"lng" : 114.114659
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "Caritas Jockey Club Tsuen Wan Clinic",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.367854,
											"lng" : 114.116038
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "Indi Home [Chelsea Court]	",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.366542,
											"lng" : 114.118651
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "Chun Shing Factory Est",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.360944,
											"lng" : 114.120316
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "Blk 10 Kwai Shing W Est",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.359682,
											"lng" : 114.122478
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "S Kwai Chung Jockey Club Polyclinic",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.360896,
											"lng" : 114.124779
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "Kwai Luen Est Phase 2",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.361935,
											"lng" : 114.126464
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "Shing Lok Hse Kwai Shing E Est",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.362454,
											"lng" : 114.127744
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "Fung Yat Social Service Complex",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.364381,
											"lng" : 114.130298
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "Sun Kwai Hing Gardens",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.363939,
											"lng" : 114.130823
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "Kwai Hong Court",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.362904,
											"lng" : 114.130612
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "Kwai Hei Hse Kwai Fong Est",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.359719,
											"lng" : 114.128341
									}
							}
					]
			},
			{
					"stops" : [
							{
									"stop_name_en" : "MTR Kwai Fong Station, Hing Ning Rd [Metroplaza]",
									"stop_nickname_en" : "",
									"stop_nickname_tc" : "",
									"latlng" : {
											"lat" :
			22.357636,
											"lng" : 114.127715
									}
							}
					]
			},

		]
		//return 'sdasdads'
	}else {
		return 'errror'
	}


	let busStops = [];
	busRoutes.forEach(function(busRoute) {
		busRoute.stops.forEach(function(stop) {
			busStops.push(stop);
		});
	});

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
