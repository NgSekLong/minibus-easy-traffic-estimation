
const google_map_helper = require('./google_map_helper');
const google_map_helper_87k = require('./google_map_helper_87k');

// Using ES6 imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const BusRoute = require('../Schema/BusRoute');


const MONGODB_CONNECTION_URI = 'mongodb://34.92.207.254/local'
const MONGODB_BUS_COLLECTION = 'bus_routes';



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

    var param = req.body;
		if(!param.route_id){
			res.send("error");
			return;
		}
		mongoose.connect(MONGODB_CONNECTION_URI, {useNewUrlParser: true});

		i = 0

		const BusRouteModel = mongoose.model(MONGODB_BUS_COLLECTION, BusRoute);
		BusRouteModel.find({route_id: param.route_id}, async function (err, bus) {
			if(bus.length == 0){
				res.send('No Route');
				return;
			}
			var bus_stops = bus[0]['bus_routes']['bus_stops'][0]//.bus_routes[i].bus_stops;

	    var arrivalTimeInfo = await google_map_helper.request_arrival_time(bus_stops);
			console.log(arrivalTimeInfo);
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
};
