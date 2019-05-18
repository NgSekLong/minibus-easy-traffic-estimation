
const google_map_helper = require('./google_map_helper');
const distance_calculator_helper = require('./distance_calculator_helper');
const util = require('util')

// Using ES6 imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const BusRoute = require('../Schema/BusRoute');
const BusRouteDuration = require('../Schema/BusRouteDuration');
const DriverLatLng = require('../Schema/DriverLatLng');
const DriverLastKnownLatLng = require('../Schema/DriverLastKnownLatLng');



const MONGODB_CONNECTION_URI = 'mongodb://minibus:CDd[<HX8p{9;1ykn@35.229.230.82/admin'
const MONGODB_BUS_COLLECTION = 'bus_routes';
const MONGODB_BUS_DURATION_COLLECTION = 'bus_routes_duration';
const MONGODB_DRIVERLATLNG_COLLECTION = 'driver_latlng';
const MONGODB_DRIVER_LAST_KNOWN_LATLNG_COLLECTION = 'driver_last_known_latlng';
const MONGODB_CONNECTION_PARAM = {
  useNewUrlParser: true,
  auth: {
      authdb: 'admin',
      // user: ['minibus'],
      // pass: ['CDd[<HX8p{9;@ykn'],
  }
}

const VALID_DISTANCE_M_BETWEEN_GPS_AND_BUS_STOP = 500;
const VALID_DISTANCE_M_BETWEEN_CURRENT_AND_LAST_GPS = 30;

const BUS_ROUTE_DURATION_EXPIRATION_MILLISECOND = 30 * 24 * 60 * 60 * 1000; // 30 days




// routes/note_routes.js
module.exports = function(app, db) {

  let combineBusRouteWithDuration = function(busRouteObject, busRouteDurationObject) {
    for(var i = 0; i < busRouteObject.bus_routes.length; i ++){
      busRouteObject.bus_routes[i].last_update_at = busRouteDurationObject.bus_routes[i].last_update_at;
      for(var j = 0; j < busRouteObject.bus_routes[i].bus_stops.length; j++){
        busRouteObject.bus_routes[i].bus_stops[j].duration_sec = busRouteDurationObject.bus_routes[i].bus_stops[j].duration_sec;
        busRouteObject.bus_routes[i].bus_stops[j].duration_sec = busRouteDurationObject.bus_routes[i].bus_stops[j].duration_sec;
      }
    }
    return busRouteObject;
  }

  let getArrivalTimeInfos = async function(busRouteObject, route_id, route_num_counter) {
		if(busRouteObject.length == 0){
      return false;
		}
    if(busRouteObject.bus_routes.length <= route_num_counter){
      return false;
    }

    // Find if previous already have a query duration_sec
    const BusRouteDurationModel = mongoose.model(MONGODB_BUS_DURATION_COLLECTION, BusRouteDuration);
    let busRouteDurationObject = await BusRouteDurationModel.findOne({route_id: route_id});

    // TODO: Check if busRouteDurationObject last updated time is expired
    // 30 * 24 * 60 * 60 * 1000
    // console.log('busRouteDurationObject.last_update_at.getTime()', busRouteDurationObject.last_update_at.getTime());
    // console.log('Date.now()', Date.now());
    if(busRouteDurationObject === null ||
      (busRouteDurationObject !== null && busRouteDurationObject.last_update_at.getTime() <= Date.now() + BUS_ROUTE_DURATION_EXPIRATION_MILLISECOND)) {
      var busRouteDurationParam = {};
      busRouteDurationParam.route_id = busRouteObject.route_id;
      busRouteDurationParam.last_update_at = Date.now();
      busRouteDurationParam.bus_routes = [];
      for(var i = 0; i < busRouteObject.bus_routes.length; i++){
        var busStops = busRouteObject.bus_routes[i].bus_stops;
        var arrivalTimeInfos = await google_map_helper.request_arrival_time(busStops);
        busRouteDurationParam.bus_routes.push({
          bus_stops: arrivalTimeInfos
        })
        // busRouteDurationParam.bus_routes[i].bus_stops = arrivalTimeInfos;
      }

      if(busRouteDurationObject === null) {
          busRouteDurationObject = new BusRouteDurationModel(busRouteDurationParam);
          busRouteDurationObject.save();
      } else {
        busRouteDurationObject = await BusRouteDurationModel.findOneAndUpdate({route_id: route_id}, busRouteDurationParam);
      }
    }
    //console.log('busRouteDurationObject', busRouteDurationObject);

    var busInfo = combineBusRouteWithDuration(busRouteObject, busRouteDurationObject);

    var arrivalTimeInfos = busInfo.bus_routes[route_num_counter].bus_stops;

    return arrivalTimeInfos;
  }

  app.post('/passenger_request_arrival_real_time', async(req, res) => {

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
    var route_id = param.route_id;
    var route_num_counter = param.route_num_counter;

    const BusRouteModel = mongoose.model(MONGODB_BUS_COLLECTION, BusRoute);
    const busRouteObject = await BusRouteModel.findOne({route_id: route_id});
    var arrivalTimeInfos = await getArrivalTimeInfos(busRouteObject, route_id, route_num_counter);

    if (arrivalTimeInfos === false){
				res.send('no Route or route_num_counter too large ');
				return;
    }

    // Calculate arrival time!
    // Step 1: Get all DriverLastKnownLatLng based on: route_id and route_num_counter
    // Step 2: For each DriverLastKnownLatLng:
    //          - For each bus stops
    //          - Calculate one round of route time
    // Step 3: Combine all the above records into a list of arival timeout

    let busRouteLength = busRouteObject.bus_routes.length;

    let ROUTE_TYPE_ENUM = {
      CIRCULAR: 1,
      REGULAR: 2,
      UNKNOWN: 3,
    };
    let currentRouteType;
    switch (busRouteLength) {
      case 1:
        currentRouteType = ROUTE_TYPE_ENUM.CIRCULAR;
        break;
      case 2:
        currentRouteType = ROUTE_TYPE_ENUM.REGULAR;
        break;
      default:
        currentRouteType = ROUTE_TYPE_ENUM.UNKNOWN;
    }

    const DriverLastKnownLatLngModel = mongoose.model(MONGODB_DRIVER_LAST_KNOWN_LATLNG_COLLECTION, DriverLastKnownLatLng);

    var driverLastKnownLatLngs = await DriverLastKnownLatLngModel.find({ route_id });

    //console.log('driverLastKnownLatLngs', driverLastKnownLatLngs);

    let currentRouteNumCounter = route_num_counter;

    let arrivalTimeLatLngInfo = [];

    let totalRouteTime = arrivalTimeInfos.reduce(function (acc, obj) { return acc + obj.duration_sec; }, 0);


    //console.log('totalRouteTime', totalRouteTime);

    driverLastKnownLatLngs.forEach(async function (driverLastKnownLatLng) {
      const driverLastKnownBusStopNumCounter = driverLastKnownLatLng.bus_stop_num_counter;
      const driverLastKnownRouteNumCounter = driverLastKnownLatLng.route_num_counter;
      var driverLastKnownTimeDelta = Date.now() - driverLastKnownLatLng.location.time.getTime() ;
      driverLastKnownTimeDelta = ~~(driverLastKnownTimeDelta / 1000);
      // console.log('driverLastKnownTimeDelta', driverLastKnownTimeDelta);

      let accumulatedTime = 0;
      switch (currentRouteType) {
        case ROUTE_TYPE_ENUM.CIRCULAR:
          for(let repeatCounter = 0; repeatCounter < 3; repeatCounter++){
            for(var i = 0; i < arrivalTimeInfos.length; i ++){
              if(repeatCounter == 0 && i < driverLastKnownBusStopNumCounter) {
                // No need to look back, things in the past #deep
                continue;
              }
              var arrivalTimeInfo = arrivalTimeInfos[i];
              if(!arrivalTimeInfo.hasOwnProperty('arrival_times')){
                arrivalTimeInfo.arrival_times = [];
              }
              accumulatedTime += arrivalTimeInfo.duration_sec;
              var arrivalTime = accumulatedTime - driverLastKnownTimeDelta;
              if(arrivalTime >= 0){
                arrivalTimeInfo.arrival_times.push(arrivalTime);
              }
            }
            // Another round
            // accumulatedTime += totalRouteTime;
          }
          //
          // let busRouteLength = busRouteObject.bus_routes.length;
          // for(var i = 0; i < busRouteLength; i ++){
          //   busRouteObject.bus_routes[i];
          // }

          break;
        case ROUTE_TYPE_ENUM.REGULAR:

          for(let repeatCounter = 0; repeatCounter < 3; repeatCounter++){
            // targetedRouteNumCounter will go from 0 to 1 or 1 to 0, and repeat
            // Whether or not is 0 or 1 beased on driver last known route num
            var targetedRouteNumCounter = (driverLastKnownRouteNumCounter + repeatCounter) % 2;

            const BusRouteModel = mongoose.model(MONGODB_BUS_COLLECTION, BusRoute);
            const busRouteObject = await BusRouteModel.findOne({route_id: route_id});
            var targetedArrivalTimeInfos = await getArrivalTimeInfos(busRouteObject, route_id, targetedRouteNumCounter);

            for(var i = 0; i < targetedArrivalTimeInfos.length; i ++){
              if(repeatCounter == 0 && i < driverLastKnownBusStopNumCounter) {
                // No need to look back, things in the past #deep
                continue;
              }
              var arrivalTimeInfo = targetedArrivalTimeInfos[i];
              if(!arrivalTimeInfo.hasOwnProperty('arrival_times')){
                arrivalTimeInfo.arrival_times = [];
              }
              accumulatedTime += arrivalTimeInfo.duration_sec;
              var arrivalTime = accumulatedTime - driverLastKnownTimeDelta;
              if(arrivalTime >= 0){
                arrivalTimeInfo.arrival_times.push(arrivalTime);
              }
            }
            // Another round
            // accumulatedTime += totalRouteTime;
          }
          break;
        default:
          currentRouteType = ROUTE_TYPE_ENUM.UNKNOWN;
      }

    });

		res.send(arrivalTimeInfos);

  });



  app.post('/list_bueses', async(req, res) => {
     var param = req.body;
    var mongoQuery = {};
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

			res.send(returnBuses);
		  // docs.forEach
		});

  });

  var saveLatLngToDriverLatLng = async function(lat, lng, time, route_id, mac_address){

  		mongoose.connect(MONGODB_CONNECTION_URI, MONGODB_CONNECTION_PARAM);

      let returnBuses = [];
  		const DriverLatLngModel = mongoose.model(MONGODB_DRIVERLATLNG_COLLECTION, DriverLatLng);


      var driverLatLng = await DriverLatLngModel.findOne({ mac_address, route_id });
      if(!driverLatLng){
          driverLatLng = new DriverLatLngModel({ mac_address, route_id });
      }
      driverLatLng.locations.push({lat,lng,time});
      await driverLatLng.save();
  }

  var findPreviousLatLngFromDriverLocation = function(currrentLatLng, locations){
    // Only find the closest 7 items to previous infinity loop war
    var endAt = (locations.length > 10) ? locations.length - 7 : 0;
    for(var i = locations.length -1 ; i >= endAt; i--){
      var possiblePreviousLatLng = locations[i];

      var distance = distance_calculator_helper.distanceInMBetweenEarthCoordinates (
        possiblePreviousLatLng.lat,
        possiblePreviousLatLng.lng,
        currrentLatLng.lat,
        currrentLatLng.lng);
      console.log('distance', distance);
      if(distance > VALID_DISTANCE_M_BETWEEN_CURRENT_AND_LAST_GPS){
        return possiblePreviousLatLng;
      }
    }
    return null;
  }

  var calculateDriverLastKnowStop = async function (route_id, mac_address) {
      const DriverLatLngModel = mongoose.model(MONGODB_DRIVERLATLNG_COLLECTION, DriverLatLng);
  		const BusRouteModel = mongoose.model(MONGODB_BUS_COLLECTION, BusRoute);
      const DriverLastKnownLatLngModel = mongoose.model(MONGODB_DRIVER_LAST_KNOWN_LATLNG_COLLECTION, DriverLastKnownLatLng);

      const driverLatLng = await DriverLatLngModel.findOne({ mac_address, route_id });
      const busRoute = await BusRouteModel.findOne({ route_id });

      if(driverLatLng.locations.length < 2){
        console.log('Only one point of reference, skiped');
        // Only one point of reference, skiped
        return;
      }
      var currrentLatLng = driverLatLng.locations[driverLatLng.locations.length - 1];

      // console.log('currrentLatLng', currrentLatLng);
      // console.log('busRoute', busRoute);


      busRoute.bus_routes.forEach(async function(singleBusRoute, routeNumCounter) {
        var closestBusStop = null;
        singleBusRoute.bus_stops.forEach(function (busStops, busStopNumCounter) {

          var distance = distance_calculator_helper.distanceInMBetweenEarthCoordinates (
            busStops.latlng.lat,
            busStops.latlng.lng,
            currrentLatLng.lat,
            currrentLatLng.lng);
          if(distance < VALID_DISTANCE_M_BETWEEN_GPS_AND_BUS_STOP &&
            (!closestBusStop ||
            closestBusStop.distance > distance)){

            var isDestionation = false;
            if(singleBusRoute.bus_stops.length - 1 == busStopNumCounter ){
              isDestionation = true;
            }

            closestBusStop = {
              route_num_counter: routeNumCounter,
              bus_stop_num_counter: busStopNumCounter,
              distance: distance,
              latlng: currrentLatLng,
              is_destination: isDestionation,
            };
          }
          // console.log('distance', distance);
        });
        // console.log('closestBusStop', closestBusStop);
        // Check if bus is traveling at the same direction as the bus route plan

        // Case 1: if no next bus stops
        // - Bus is in last destination
        // - No need to insert to DriverLastKnownLatLng
        // Case 2: ('current' to 'Next bus stop' distance < 'previous' to 'Next bus stop' distance)
        // - Bus is headed toward next bus stops
        // - Save driver last know lat lng

        console.log('routeNumCounter', routeNumCounter);
        if(!closestBusStop){
          console.log('Too far away from any bus stop');
          return
        }
        // Check if have next bus stop
        if(closestBusStop.is_destination == true){
          console.log('Is last station');
          // Is last station, can continue
          return;
        }
        var nextClosestBusStopLatLng = singleBusRoute.bus_stops[closestBusStop.bus_stop_num_counter + 1];

        // Find previous latlng
        var previousLatLng = findPreviousLatLngFromDriverLocation(currrentLatLng, driverLatLng.locations);
        //console.log('previousLatLng', previousLatLng);

        // No previous latlng
        if(previousLatLng == null){
          console.log('No previous lat lng');
          return;
        }

        var previousGpsToBusStopDistance = distance_calculator_helper.distanceInMBetweenEarthCoordinates (
          previousLatLng.lat,
          previousLatLng.lng,
          nextClosestBusStopLatLng.latlng.lat,
          nextClosestBusStopLatLng.latlng.lng);

        var currentGpsToBusStopDistance = distance_calculator_helper.distanceInMBetweenEarthCoordinates (
          currrentLatLng.lat,
          currrentLatLng.lng,
          nextClosestBusStopLatLng.latlng.lat,
          nextClosestBusStopLatLng.latlng.lng);

        //console.log('routeNumCounter', routeNumCounter);
        console.log('currrentLatLng', currrentLatLng);
        console.log('previousLatLng', previousLatLng);
        console.log('nextClosestBusStopLatLng', nextClosestBusStopLatLng);
        console.log('currentGpsToBusStopDistance', currentGpsToBusStopDistance);
        console.log('previousGpsToBusStopDistance', previousGpsToBusStopDistance);

        if(currentGpsToBusStopDistance < previousGpsToBusStopDistance){
          // Need to update DriverLastKnownLatLngModel!
          var route_num_counter = routeNumCounter;
          var driverLastKnownLatLng = await DriverLastKnownLatLngModel.findOne({ mac_address, route_id, route_num_counter });

          if (!driverLastKnownLatLng) {
            // Initialize driver last know lat lng if possible
            driverLastKnownLatLng =  new DriverLastKnownLatLngModel({ mac_address, route_id, route_num_counter });
          }
          driverLastKnownLatLng.location = {
            lat: currrentLatLng.lat,
            lng: currrentLatLng.lng,
            time: currrentLatLng.time,
          };
          driverLastKnownLatLng.bus_stop_num_counter = closestBusStop.bus_stop_num_counter;
          console.log('driverLastKnownLatLng', driverLastKnownLatLng);
          console.log('closestBusStop.bus_stop_num_counter', closestBusStop.bus_stop_num_counter);
          await driverLastKnownLatLng.save();
          console.log('Saved driverLastKnownLatLng')
        }
      });




  }

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
    await saveLatLngToDriverLatLng(lat, lng, time, route_id, mac_address);
    await calculateDriverLastKnowStop(route_id, mac_address);

		res.send('Done');
    return;


  });
};
