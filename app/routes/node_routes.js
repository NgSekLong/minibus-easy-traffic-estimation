
const google_map_helper = require('./google_map_helper')



const googleMapsClient = require('@google/maps').createClient({
	  key: 'AIzaSyCr9MZPxhv_sqvd3E53DqUaJvo9t8yBLRQ',
    Promise: Promise
});


// routes/note_routes.js
module.exports = function(app, db) {
  app.post('/passenger_request_arrival_time', async(req, res) => {
    // You'll create your note here.
    var arrivalTimeInfo = await google_map_helper.request_arrival_time();
     //res.body('yup');
     res.send(arrivalTimeInfo);

     //var return_data = await google_map_helper.request_arrival_time();
    // console.log(return_data);
    // console.log(return_data);
    // res.send(JSON.stringify(return_data));
  });
};

function callGoogleAPI() {
  return googleMapsClient.geocode({address: '1600 Amphitheatre Parkway, Mountain View, CA'})
    .asPromise()
    .then((response) => {
      return response.json.results;
      //console.log(response.json.results);
    })
    .catch((err) => {
      console.log(err);
    });
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
    await timeout(3000);
    return fn(...args);
}
