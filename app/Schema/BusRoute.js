
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BusRoute = new Schema({
  id: ObjectId,
  route_id: String,
  route_number: String,
  bus_routes : {
    bus_stops: Object
  },
});



module.exports = BusRoute
