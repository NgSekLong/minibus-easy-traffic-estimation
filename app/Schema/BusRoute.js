
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BusRoute = new Schema({
  id: ObjectId,
  route_id: String,
  route_number: String,
  region: String,
  bus_routes : [{
    bus_stops: Object,
    route_start_at_en: String,
    route_start_at_tc: String,
    route_end_at_en: String,
    route_end_at_tc: String,
  }],
});

module.exports = BusRoute
