
const google_map_helper = require('./google_map_helper');
const google_map_helper_87k = require('./google_map_helper_87k');

// Using ES6 imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const BusRoute = require('../Schema/BusRoute');
const DriverLatLng = require('../Schema/DriverLatLng');


const MONGODB_CONNECTION_URI = 'mongodb://minibus:CDd[<HX8p{9;1ykn@35.187.148.7/admin'
const MONGODB_BUS_COLLECTION = 'bus_routes';
const MONGODB_DRIVERLATLNG_COLLECTION = 'driver_latlng';
const MONGODB_CONNECTION_PARAM = {
    //uri_decode_auth: true ,
  useNewUrlParser: true,
  auth: {
      authdb: 'admin',
      // user: ['minibus'],
      // pass: ['CDd[<HX8p{9;@ykn'],
  }
}



// routes/note_routes.js
module.exports = function(app, db) {
  app.post('/passenger_request_arrival_time_87k', async(req, res) => {
    var param = req.body;
    var query = req.query; // $_GET["id"]

		if(!query.direction){

			res.send("error");
			return;
		}


    var arrivalTimeInfo = await google_map_helper_87k.request_arrival_time(query.direction);
     res.send(arrivalTimeInfo);

  });


  app.post('/passenger_request_arrival_real_time', async(req, res) => {

    // res.setHeader('Content-Type', 'application/json');
    // res.send('[{"title":"123"}]');
    // return;
    var param = req.body;
		if(!param.route_id ){
      res.sendStatus(404)
			res.send("error");
			return;
		}
    if(!param.route_num_counter){
      param.route_num_counter = 0;
    }
		mongoose.connect(MONGODB_CONNECTION_URI, MONGODB_CONNECTION_PARAM);

		i = 0

		const BusRouteModel = mongoose.model(MONGODB_BUS_COLLECTION, BusRoute);
		BusRouteModel.find({route_id: param.route_id}, async function (err, bus) {
			if(bus.length == 0){
				res.send('No Route');
				return;
			}
      // console.log(bus[0]['bus_routes'][0]['bus_stops']);
      var busRoutes = bus[0]['bus_routes'];
      if(busRoutes.length <= param.route_num_counter){
  				res.send('route_num_counter too large');
  				return;
      }
      var bus_stops = busRoutes[param.route_num_counter]['bus_stops']; //.bus_routes[i].bus_stops;

	    var arrivalTimeInfo = await google_map_helper.request_arrival_time(bus_stops);
			//console.log(arrivalTimeInfo);
			res.send(arrivalTimeInfo);
		  // docs.forEach
		});


  // BusRouteModel.find({}, function(err, users) {
	// 	console.log(users);
  //   var userMap = {};
	//
  //   users.forEach(function(user) {
  //     userMap[user._id] = user;
  //   });
	//
  //   res.send(userMap);
  // });

    // var param = req.body;
    // var arrivalTimeInfo = await google_map_helper.request_arrival_time();
    //  res.send(arrivalTimeInfo);

  });



  app.post('/list_bueses', async(req, res) => {

    // res.setHeader('Content-Type', 'application/json');
    // res.send('[{"title":"123"}]');
    // return;
     var param = req.body;
		// if(!param.route_id){
    //   res.sendStatus(404)
		// 	res.send("error");
		// 	return;
		// }
    var mongoQuery = {};
    // if(!param.route_id){
    //   res.sendStatus(404)
    //   res.send("error");
    //   return;
    // }
    if(param.region){
      mongoQuery.region = param.region;
    }
		mongoose.connect(MONGODB_CONNECTION_URI, MONGODB_CONNECTION_PARAM);

		i = 0

    let returnBuses = [];
		const BusRouteModel = mongoose.model(MONGODB_BUS_COLLECTION, BusRoute);
		BusRouteModel.find(mongoQuery).sort('route_number').exec( async function (err, buses) {

			if(buses.length == 0){
				res.send('No Route');
				return;
			}

      console.log(buses);
      buses.forEach(function(bus) {

        let busRoutes = bus['bus_routes'];
        //console.log(busRoutes.count());
        //asd

        // for(let i =0; i < busRoutes.length; i ++){
        //     bus_route = busRoutes[i];
        //
        //     console.log('bus_route', bus_route);
        //     return ;
        //
        //     let route_id = bus.route_id;
        //     let route_number = bus.route_number;
        //     let region = bus.region;
        //
        //     let route_start_at_en = bus_route.route_start_at_en;
        //     let route_start_at_tc = bus_route.route_start_at_tc;
        //
        //
        //     let route_end_at_en = bus_route.route_end_at_en;
        //     let route_end_at_tc = bus_route.route_end_at_tc;
        //     returnBuses.push({route_id, route_number, region, route_start_at_en, route_start_at_tc, route_end_at_en, route_end_at_tc})
        //
        //
        // }
        // console.log('something?');
        // console.log(returnBuses);
        // return;
        busRoutes.forEach(function(bus_route) {
          let route_id = bus.route_id;
          let route_number = bus.route_number;
          let region = bus.region;

          let route_start_at_en = bus_route.route_start_at_en;
          let route_start_at_tc = bus_route.route_start_at_tc;

          let route_end_at_en = bus_route.route_end_at_en;
          let route_end_at_tc = bus_route.route_end_at_tc;

          returnBuses.push({route_id, route_number, region, route_start_at_en, route_start_at_tc, route_end_at_en, route_end_at_tc})
        });
      });

			// var bus_stops = bus[0]['bus_routes']['bus_stops'][0]//.bus_routes[i].bus_stops;
      //
	    // var arrivalTimeInfo = await google_map_helper.request_arrival_time(bus_stops);
			// console.log(arrivalTimeInfo);
			res.send(returnBuses);
		  // docs.forEach
		});


  // BusRouteModel.find({}, function(err, users) {
	// 	console.log(users);
  //   var userMap = {};
	//
  //   users.forEach(function(user) {
  //     userMap[user._id] = user;
  //   });
	//
  //   res.send(userMap);
  // });

    // var param = req.body;
    // var arrivalTimeInfo = await google_map_helper.request_arrival_time();
    //  res.send(arrivalTimeInfo);

  });


  app.post('/submit_gps', async(req, res) => {
    var param = req.body;

		if(!param.mac_address){
			res.send('Missing mac_address');
			return;
		}
		if(!param.route_id){
			res.send('Missing route_id');
			return;
		}
		if(!param.lat || !param.lng || !param.time){
			res.send('Missing lat, lng or time');
			return;
		}
    const mac_address = param.mac_address;
    const lat = param.lat;
    const lng = param.lng;
    const time = param.time * 1000;
    const route_id = param.route_id;

		mongoose.connect(MONGODB_CONNECTION_URI, MONGODB_CONNECTION_PARAM);

    let returnBuses = [];
		const DriverLatLngModel = mongoose.model(MONGODB_DRIVERLATLNG_COLLECTION, DriverLatLng);


    var driverLatLng = await DriverLatLngModel.findOne({ mac_address });
    if(!driverLatLng){
        driverLatLng = new DriverLatLngModel({ mac_address });
    }
    driverLatLng.locations.push({lat,lng,time});
    driverLatLng.route_id = route_id;
    await driverLatLng.save();
    console.log(driverLatLng);
		res.send('Done');
    return;


  });
};
