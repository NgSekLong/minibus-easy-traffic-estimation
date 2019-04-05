
const google_map_helper = require('./google_map_helper')



const googleMapsClient = require('@google/maps').createClient({
	  key: 'AIzaSyCr9MZPxhv_sqvd3E53DqUaJvo9t8yBLRQ',
    Promise: Promise
});


// routes/note_routes.js
module.exports = function(app, db) {
  app.post('/passenger_request_arrival_time', async(req, res) => {
    var param = req.body;
    var arrivalTimeInfo = await google_map_helper.request_arrival_time();
     res.send(arrivalTimeInfo);

  });
};
